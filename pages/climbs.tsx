import type { GetStaticProps } from 'next'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import Head from 'next/head'
import Link from 'next/link'
import { useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Trkpt {
  lat: number
  lon: number
  ele: number
}

interface ClimbData {
  id: number
  startKm: number
  endKm: number
  distanceKm: number
  elevationGain: number
  startEle: number
  peakEle: number
  avgGradient: number
  maxGradient: number
  profile: number[]
}

interface Props {
  routeName: string
  climbs: ClimbData[]
  routeProfile: number[]
  totalDistanceKm: number
  totalElevationGain: number
  highlights: Array<{ start: number, end: number }>
}

// ─── GPX + climb computation (runs on server and client) ─────────────────────

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a
    = Math.sin(dLat / 2) ** 2
      + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function smooth(arr: number[], w: number): number[] {
  return arr.map((_, i) => {
    const s = Math.max(0, i - Math.floor(w / 2))
    const e = Math.min(arr.length, s + w)
    const slice = arr.slice(s, e)
    return slice.reduce((a, b) => a + b, 0) / slice.length
  })
}

function downsample(arr: number[], n: number): number[] {
  if (arr.length <= n)
    return arr
  const step = (arr.length - 1) / (n - 1)
  return Array.from({ length: n }, (_, i) => arr[Math.round(i * step)])
}

function detectClimbs(
  smoothedEle: number[],
  cumKm: number[],
): Array<{ start: number, end: number }> {
  const MIN_GAIN = 75 // Garmin ClimbPro minimum
  const MIN_KM = 0.5
  const MIN_GRAD = 3 // Garmin ClimbPro minimum avg grade
  const MAX_DROP = 30 // allows ~25 m inter-peak saddles (Garmin merges them)

  const segments: Array<{ start: number, end: number }> = []
  let i = 0

  while (i < smoothedEle.length - 1) {
    if (i > 0 && smoothedEle[i] > smoothedEle[i - 1]) {
      i++
      continue
    }

    let peakIdx = i
    let peakEle = smoothedEle[i]
    let valley = smoothedEle[i]
    let j = i + 1

    while (j < smoothedEle.length) {
      if (smoothedEle[j] > peakEle) {
        peakIdx = j
        peakEle = smoothedEle[j]
        valley = peakEle
      }
      else {
        valley = Math.min(valley, smoothedEle[j])
        if (peakEle - valley > MAX_DROP)
          break
      }
      j++
    }

    // Walk back from peak to find the foot: the lowest elevation in [i, peakIdx]
    // that still gives gradient ≥ MIN_GRAD to the peak. This reports the true
    // valley-to-peak gain instead of always clipping it to MIN_GAIN.
    let footIdx = peakIdx
    let footEle = smoothedEle[peakIdx]
    for (let k = peakIdx - 1; k >= i; k--) {
      const ele = smoothedEle[k]
      if (ele < footEle) {
        const d = (cumKm[peakIdx] - cumKm[k]) * 1000
        const g = d > 0 ? (peakEle - ele) / d * 100 : 0
        if (g >= MIN_GRAD) {
          footEle = ele
          footIdx = k
        }
      }
    }

    const gain = peakEle - smoothedEle[footIdx]
    const dist = cumKm[peakIdx] - cumKm[footIdx]
    const grad = dist > 0 ? (gain / (dist * 1000)) * 100 : 0

    if (gain >= MIN_GAIN && dist >= MIN_KM && grad >= MIN_GRAD)
      segments.push({ start: footIdx, end: peakIdx })

    i = peakIdx > i ? peakIdx : i + 1
  }

  return segments
}

function parseGpxToProps(xml: string): Props {
  const nameMatch = xml.match(/<metadata>[\s\S]*?<name>([^<]+)<\/name>/)
  const routeName = nameMatch?.[1]?.trim() ?? 'Route'

  const lines = xml.split('\n')
  const pts: Trkpt[] = []
  let pendingLat = 0
  let pendingLon = 0

  for (const line of lines) {
    const trkMatch = line.match(/trkpt lat="([^"]+)" lon="([^"]+)"/)
    if (trkMatch) {
      pendingLat = Number.parseFloat(trkMatch[1])
      pendingLon = Number.parseFloat(trkMatch[2])
    }
    const eleMatch = line.match(/<ele>([^<]+)<\/ele>/)
    if (eleMatch && pendingLat !== 0) {
      pts.push({ lat: pendingLat, lon: pendingLon, ele: Number.parseFloat(eleMatch[1]) })
      pendingLat = 0
      pendingLon = 0
    }
  }

  const cumKm: number[] = [0]
  for (let i = 1; i < pts.length; i++)
    cumKm.push(cumKm[i - 1] + haversineKm(pts[i - 1].lat, pts[i - 1].lon, pts[i].lat, pts[i].lon))

  const totalKm = cumKm[cumKm.length - 1]
  const smoothedEle = smooth(pts.map(p => p.ele), 20)

  let totalGain = 0
  for (let i = 1; i < smoothedEle.length; i++) {
    const delta = smoothedEle[i] - smoothedEle[i - 1]
    if (delta > 0)
      totalGain += delta
  }

  const segments = detectClimbs(smoothedEle, cumKm)
  const highlights: Props['highlights'] = []

  const climbs: ClimbData[] = segments.map((seg, idx) => {
    const segEle = smoothedEle.slice(seg.start, seg.end + 1)
    const startKm = cumKm[seg.start]
    const endKm = cumKm[seg.end]
    const distKm = endKm - startKm
    const startEle = segEle[0]
    const peakEle = Math.max(...segEle)
    const gain = peakEle - startEle
    const avgGrad = distKm > 0 ? (gain / (distKm * 1000)) * 100 : 0

    // 300 m window avoids gradient inflation from GPS jitter at slow speed
    // (dense 1 Hz recordings on steep sections have many points per metre,
    // making 100 m windows too short to average out position errors)
    let maxGrad = 0
    for (let j = seg.start + 1; j <= seg.end; j++) {
      let k = j - 1
      while (k > seg.start && (cumKm[j] - cumKm[k]) * 1000 < 300)
        k--
      const d = (cumKm[j] - cumKm[k]) * 1000
      if (d >= 150) {
        const g = (smoothedEle[j] - smoothedEle[k]) / d * 100
        if (g > maxGrad)
          maxGrad = g
      }
    }

    highlights.push({ start: startKm / totalKm, end: endKm / totalKm })

    return {
      id: idx + 1,
      startKm,
      endKm,
      distanceKm: distKm,
      elevationGain: gain,
      startEle,
      peakEle,
      avgGradient: avgGrad,
      maxGradient: maxGrad,
      profile: downsample(segEle, 80),
    }
  })

  return {
    routeName,
    climbs,
    routeProfile: downsample(smoothedEle, 300),
    totalDistanceKm: totalKm,
    totalElevationGain: totalGain,
    highlights,
  }
}

// ─── SVG elevation profile ────────────────────────────────────────────────────

function ElevationProfile({
  data,
  svgHeight = 72,
  highlights = [],
}: {
  data: number[]
  svgHeight?: number
  highlights?: Array<{ start: number, end: number }>
}) {
  const W = 400
  const H = svgHeight
  const PX = 0
  const PY = 4

  if (data.length < 2)
    return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const px = (i: number) => PX + (i / (data.length - 1)) * (W - PX * 2)
  const py = (e: number) => H - PY - ((e - min) / range) * (H - PY * 2)

  const pts = data.map((e, i) => `${px(i).toFixed(1)},${py(e).toFixed(1)}`)
  const line = `M ${pts.join(' L ')}`
  const area = `${line} L ${px(data.length - 1).toFixed(1)},${H} L ${px(0).toFixed(1)},${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full">
      {highlights.map((h, i) => {
        const x1 = px(Math.round(h.start * (data.length - 1)))
        const x2 = px(Math.round(h.end * (data.length - 1)))
        return (
          <rect
            key={i}
            x={x1.toFixed(1)}
            y={0}
            width={(x2 - x1).toFixed(1)}
            height={H}
            fill="#6366f1"
            fillOpacity={0.2}
          />
        )
      })}
      <path d={area} fill="#6366f1" fillOpacity={0.12} />
      <path d={line} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Climb category (Strava: dist_m × avg_grade_% = gain_m × 100) ───────────
// The length × grade formula always reduces to elevationGain × 100, so only
// gain determines the category. Cat 4 requires gain > 80 m.

function category(elevationGain: number): { label: string, cls: string } {
  const score = elevationGain * 100
  if (score > 80_000)
    return { label: 'HC', cls: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' }
  if (score > 64_000)
    return { label: 'Cat 1', cls: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' }
  if (score > 32_000)
    return { label: 'Cat 2', cls: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' }
  if (score > 16_000)
    return { label: 'Cat 3', cls: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' }
  if (score > 8_000)
    return { label: 'Cat 4', cls: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' }
  return { label: 'Uncategorized', cls: 'bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-white/40' }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Climbs(staticProps: Props) {
  const [liveData, setLiveData] = useState<Props | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { routeName, climbs, routeProfile, totalDistanceKm, totalElevationGain, highlights }
    = liveData ?? staticProps

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file)
      return
    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const xml = ev.target?.result as string
      setLiveData(parseGpxToProps(xml))
      setIsLoading(false)
    }
    reader.readAsText(file)
  }

  function reset() {
    setLiveData(null)
    if (inputRef.current)
      inputRef.current.value = ''
  }

  return (
    <>
      <Head>
        <title>{`${routeName} — Jeff Wen`}</title>
      </Head>
      <div className="mx-auto w-full max-w-168 px-4 pt-12 pb-16 md:px-6">

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/[0.08] text-gray-400 transition-colors hover:text-gray-700 dark:border-white/[0.08] dark:text-white/40 dark:hover:text-white/80"
          >
            <span className="i-ri-arrow-left-line size-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold text-gray-900 dark:text-white">{routeName}</h1>
            <p className="text-sm text-gray-500 dark:text-white/40">
              {climbs.length}
              {' '}
              climb
              {climbs.length !== 1 ? 's' : ''}
              {' '}
              ·
              {' '}
              {totalDistanceKm.toFixed(1)}
              {' '}
              km
            </p>
          </div>

          {/* File input (hidden) */}
          <input
            ref={inputRef}
            type="file"
            accept=".gpx"
            className="hidden"
            onChange={handleFile}
          />

          {liveData
            ? (
                <button
                  onClick={reset}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.08] px-3 py-1.5 text-xs text-gray-500 transition-colors hover:text-gray-700 dark:border-white/[0.08] dark:text-white/40 dark:hover:text-white/80"
                >
                  <span className="i-ri-close-line size-3.5" />
                  Reset
                </button>
              )
            : (
                <button
                  onClick={() => inputRef.current?.click()}
                  disabled={isLoading}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.08] px-3 py-1.5 text-xs text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-50 dark:border-white/[0.08] dark:text-white/40 dark:hover:text-white/80"
                >
                  <span className={`size-3.5 ${isLoading ? 'i-ri-loader-4-line animate-spin' : 'i-ri-upload-2-line'}`} />
                  {isLoading ? 'Analysing…' : 'Upload GPX'}
                </button>
              )}
        </div>

        {/* Route elevation profile */}
        <div className="mb-4 overflow-hidden rounded-3xl border border-black/[0.08] bg-white px-5 pt-4 pb-3 dark:border-white/[0.08] dark:bg-white/[0.04]">
          <p className="mb-3 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-white/30">
            Elevation Profile
          </p>
          <ElevationProfile data={routeProfile} svgHeight={80} highlights={highlights} />
          <div className="mt-1 flex justify-between text-[11px] text-gray-400 dark:text-white/30">
            <span>0 km</span>
            <span>
              {totalDistanceKm.toFixed(0)}
              {' '}
              km
            </span>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { label: 'Distance', value: `${totalDistanceKm.toFixed(1)} km`, icon: 'i-ri-route-line' },
            { label: 'Elevation gain', value: `${totalElevationGain.toFixed(0)} m`, icon: 'i-ri-landscape-line' },
            { label: 'Climbs', value: String(climbs.length), icon: 'i-ri-bar-chart-2-line' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-2xl border border-black/[0.08] bg-white p-3.5 dark:border-white/[0.08] dark:bg-white/[0.04]"
            >
              <span className={`${s.icon} mb-1.5 block size-4 text-gray-400 dark:text-white/30`} />
              <p className="text-base font-semibold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-400 dark:text-white/30">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Climb cards */}
        {climbs.length === 0
          ? (
              <p className="text-center text-sm text-gray-400 dark:text-white/30">No significant climbs detected.</p>
            )
          : (
              <div className="grid gap-3 sm:grid-cols-2">
                {climbs.map((climb) => {
                  const cat = category(climb.elevationGain)
                  return (
                    <div
                      key={climb.id}
                      className="rounded-3xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-white/[0.04]"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-white/30">
                            Climb
                            {' '}
                            {climb.id}
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                            {climb.startKm.toFixed(1)}
                            {' '}
                            –
                            {' '}
                            {climb.endKm.toFixed(1)}
                            {' '}
                            km
                          </p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cat.cls}`}>
                          {cat.label}
                        </span>
                      </div>

                      <div className="overflow-hidden rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                        <ElevationProfile data={climb.profile} svgHeight={52} />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                          <p className="text-[11px] text-gray-400 dark:text-white/30">Elevation gain</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            +
                            {climb.elevationGain.toFixed(0)}
                            {' '}
                            m
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400 dark:text-white/30">Distance</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {climb.distanceKm.toFixed(2)}
                            {' '}
                            km
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400 dark:text-white/30">Avg grade</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {climb.avgGradient.toFixed(1)}
                            %
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400 dark:text-white/30">Max grade</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {climb.maxGradient.toFixed(1)}
                            %
                          </p>
                        </div>
                        <div className="col-span-2 border-t border-black/[0.06] pt-3 dark:border-white/[0.06]">
                          <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-white/30">
                            <span>
                              {climb.startEle.toFixed(0)}
                              {' '}
                              m
                            </span>
                            <span className="i-ri-arrow-right-line size-3" />
                            <span>
                              {climb.peakEle.toFixed(0)}
                              {' '}
                              m
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
      </div>
    </>
  )
}

// ─── Static data (default route) ─────────────────────────────────────────────

export const getStaticProps: GetStaticProps<Props> = async () => {
  const gpxPath = path.join(process.cwd(), 'public', 'climb.gpx')
  const xml = fs.readFileSync(gpxPath, 'utf-8')
  return { props: parseGpxToProps(xml) }
}

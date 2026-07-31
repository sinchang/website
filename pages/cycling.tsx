import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Map as MapLibre, useMap } from '../components/ui/map'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RideData {
  run_id: number
  name: string
  distance: number
  polyline: string
  country: string
}

interface CountryStat {
  country: string
  count: number
}

interface Props {
  rides: RideData[]
  countries: CountryStat[]
  totalDistanceKm: number
}

interface RawActivity {
  run_id: number
  name: string
  distance: number
  type: string
  start_date: string
  summary_polyline: string
  location_country?: string
}

// ─── Polyline decoder ─────────────────────────────────────────────────────────

function decodePolyline(encoded: string): [number, number][] {
  const coords: [number, number][] = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let b: number
    let shift = 0
    let result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1F) << shift
      shift += 5
    } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1F) << shift
      shift += 5
    } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1

    coords.push([lng / 1e5, lat / 1e5])
  }

  return coords
}

function boundsOf(rides: RideData[]): [[number, number], [number, number]] | null {
  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  for (const ride of rides) {
    for (const [lng, lat] of decodePolyline(ride.polyline)) {
      if (lng < minLng)
        minLng = lng
      if (lng > maxLng)
        maxLng = lng
      if (lat < minLat)
        minLat = lat
      if (lat > maxLat)
        maxLat = lat
    }
  }

  return Number.isFinite(minLng) ? [[minLng, minLat], [maxLng, maxLat]] : null
}

// ─── Map overlay ──────────────────────────────────────────────────────────────

function AllRoutesOverlay({ rides, selectedCountry }: { rides: RideData[], selectedCountry: string | null }) {
  const { map, isLoaded } = useMap()
  const initialFitDone = useRef(false)

  // Add all routes as a single GeoJSON layer (re-added on theme change via isLoaded toggle)
  useEffect(() => {
    if (!map || !isLoaded)
      return

    const allCoords = rides.map(r => decodePolyline(r.polyline)).filter(c => c.length > 1)
    if (!allCoords.length)
      return

    map.addSource('all-rides', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: allCoords.map(coords => ({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: coords },
          properties: {},
        })),
      } as any,
    })
    map.addLayer({
      id: 'all-rides',
      type: 'line',
      source: 'all-rides',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#FF6464', 'line-width': 2, 'line-opacity': 0.7 },
    })

    return () => {
      try {
        if (map.getLayer('all-rides'))
          map.removeLayer('all-rides')
        if (map.getSource('all-rides'))
          map.removeSource('all-rides')
      }
      catch {}
    }
  }, [map, isLoaded])

  // Fit bounds to selected country (or all rides on initial load / deselect)
  useEffect(() => {
    if (!map || !isLoaded)
      return

    const target = selectedCountry ? rides.filter(r => r.country === selectedCountry) : rides
    const bounds = boundsOf(target)
    if (!bounds)
      return

    const animate = initialFitDone.current
    if (!initialFitDone.current)
      initialFitDone.current = true

    map.fitBounds(bounds, { padding: 60, animate })
  }, [map, isLoaded, selectedCountry])

  return null
}

function RidesMap({ rides, selectedCountry }: { rides: RideData[], selectedCountry: string | null }) {
  return (
    <MapLibre center={[0, 30]} zoom={2} className="size-full">
      <AllRoutesOverlay rides={rides} selectedCountry={selectedCountry} />
    </MapLibre>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MapPage({ rides, countries, totalDistanceKm }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  function toggleCountry(country: string) {
    setSelectedCountry(prev => prev === country ? null : country)
  }

  return (
    <>
      <Head>
        <title>Cycling — Jeff Wen</title>
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
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Rides</h1>
            <p className="text-sm text-gray-500 dark:text-white/40">
              {rides.length}
              {' '}
              rides
              {' '}
              ·
              {' '}
              {countries.length}
              {' '}
              {countries.length === 1 ? 'country' : 'countries'}
            </p>
          </div>
        </div>

        {/* Map */}
        <div className="mb-6 h-96 overflow-hidden rounded-3xl border border-black/[0.08] dark:border-white/[0.08]">
          <RidesMap rides={rides} selectedCountry={selectedCountry} />
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Total rides', value: String(rides.length), icon: 'i-ri-map-2-line' },
            { label: 'Distance', value: `${totalDistanceKm.toFixed(0)} km`, icon: 'i-ri-route-line' },
            { label: 'Countries', value: String(countries.length), icon: 'i-ri-earth-line' },
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

        {/* Country breakdown */}
        {countries.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-white/[0.04]">
            <p className="px-5 pt-4 pb-3 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-white/30">
              By Country
            </p>
            <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
              {countries.map((c, i) => (
                <button
                  key={c.country}
                  type="button"
                  onClick={() => toggleCountry(c.country)}
                  className={`flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03] ${
                    selectedCountry === c.country
                      ? 'bg-gray-50 dark:bg-white/[0.04]'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-right text-xs text-gray-400 dark:text-white/30">{i + 1}</span>
                    <span className="text-sm text-gray-900 dark:text-white">{c.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {c.count}
                      <span className="ml-0.5 text-xs font-normal text-gray-400 dark:text-white/30">rides</span>
                    </span>
                    {selectedCountry === c.country && (
                      <span className="i-ri-arrow-right-up-line size-3.5 text-gray-400 dark:text-white/30" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Static data ──────────────────────────────────────────────────────────────

function normalizeCountry(raw: string | undefined): string {
  if (!raw)
    return 'Unknown'
  const parts = raw.split(',').map(p => p.trim()).filter(Boolean)
  return parts[parts.length - 1] || 'Unknown'
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/XChangLab/workouts_page/master/src/static/activities.json')
    const data: RawActivity[] = res.ok ? await res.json() : []

    const rides = data.filter(a => a.type.toLowerCase() === 'ride' && a.summary_polyline)

    const unknown = rides.filter(r => !r.location_country)
    if (unknown.length) {
      console.warn('[cycling] rides with no location_country:', unknown.map(r => `${r.run_id} — ${r.name} (${r.start_date})`))
    }

    const countryMap = new Map<string, number>()
    for (const ride of rides) {
      const country = normalizeCountry(ride.location_country)
      countryMap.set(country, (countryMap.get(country) ?? 0) + 1)
    }

    const countries: CountryStat[] = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)

    const totalDistanceKm = rides.reduce((sum, r) => sum + r.distance / 1000, 0)

    return {
      props: {
        rides: rides.map(r => ({
          run_id: r.run_id,
          name: r.name,
          distance: r.distance,
          polyline: r.summary_polyline,
          country: normalizeCountry(r.location_country),
        })),
        countries,
        totalDistanceKm,
      },
      revalidate: 3600,
    }
  }
  catch {
    return {
      props: { rides: [], countries: [], totalDistanceKm: 0 },
      revalidate: 3600,
    }
  }
}

import type { Globe } from 'cobe'
import createGlobe from 'cobe'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

interface CheckinsGlobeProps {
  markers: [number, number][]
  count: number
  countryCount: number
}

const DARK_THEME = {
  dark: 1,
  baseColor: [0.18, 0.14, 0.28] as [number, number, number],
  markerColor: [0.65, 0.45, 1.0] as [number, number, number],
  glowColor: [0.4, 0.25, 0.7] as [number, number, number],
  mapBrightness: 5,
}

const LIGHT_THEME = {
  dark: 0,
  baseColor: [0.88, 0.85, 0.96] as [number, number, number],
  markerColor: [0.5, 0.3, 0.85] as [number, number, number],
  glowColor: [0.7, 0.6, 0.9] as [number, number, number],
  mapBrightness: 3,
}

export function CheckinsGlobe({ markers, count, countryCount }: CheckinsGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(1.2)
  const isDragging = useRef(false)
  const lastPointerX = useRef(0)
  const globeRef = useRef<Globe | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || markers.length === 0)
      return

    const size = canvas.offsetWidth
    const theme = resolvedTheme === 'light' ? LIGHT_THEME : DARK_THEME

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 1.2,
      theta: 0.25,
      diffuse: 1.4,
      mapSamples: 16000,
      markers: markers.map(([lat, lng]) => ({ location: [lat, lng] as [number, number], size: 0.04 })),
      ...theme,
    })
    globeRef.current = globe

    let rafId: number
    const animate = () => {
      if (!isDragging.current)
        phiRef.current += 0.003
      globe.update({ phi: phiRef.current })
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      globe.destroy()
      globeRef.current = null
    }
  }, [markers])

  // Sync globe colors when theme changes without recreating the globe
  useEffect(() => {
    if (!globeRef.current)
      return
    globeRef.current.update(resolvedTheme === 'light' ? LIGHT_THEME : DARK_THEME)
  }, [resolvedTheme])

  return (
    <div className="relative col-span-2 overflow-hidden rounded-3xl border border-black/[0.08] bg-gray-50 dark:border-white/[0.08] dark:bg-[rgb(14,10,22)]">
      <div className="flex h-full">
        {/* Stats */}
        <div className="flex flex-col justify-center gap-4 p-6 pr-0">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/[0.35]">Check-ins</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{count.toLocaleString()}</p>
          </div>
          {countryCount > 0 && (
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-gray-500 dark:text-white/[0.35]">Countries</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{countryCount}</p>
            </div>
          )}
        </div>

        {/* Globe */}
        <div className="relative ml-auto h-[280px] w-[280px] shrink-0">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
            onPointerDown={(e) => {
              isDragging.current = true
              lastPointerX.current = e.clientX
              e.currentTarget.setPointerCapture(e.pointerId)
              e.currentTarget.style.cursor = 'grabbing'
            }}
            onPointerMove={(e) => {
              if (!isDragging.current)
                return
              const dx = (e.clientX - lastPointerX.current) / 200
              phiRef.current += dx
              lastPointerX.current = e.clientX
            }}
            onPointerUp={(e) => {
              isDragging.current = false
              e.currentTarget.style.cursor = 'grab'
            }}
          />
        </div>
      </div>
    </div>
  )
}

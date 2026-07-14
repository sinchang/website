import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'

interface CheckinsGlobeProps {
  markers: [number, number][]
  count: number
  countryCount: number
}

export function CheckinsGlobe({ markers, count, countryCount }: CheckinsGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(1.2)
  const isDragging = useRef(false)
  const lastPointerX = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || markers.length === 0)
      return

    const size = canvas.offsetWidth
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 1.2,
      theta: 0.25,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 16000,
      mapBrightness: 5,
      baseColor: [0.18, 0.14, 0.28],
      markerColor: [0.65, 0.45, 1.0],
      glowColor: [0.4, 0.25, 0.7],
      markers: markers.map(([lat, lng]) => ({ location: [lat, lng] as [number, number], size: 0.04 })),
    })

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
    }
  }, [markers])

  return (
    <div className="relative col-span-2 overflow-hidden rounded-3xl border border-white/[0.08] bg-[rgb(14,10,22)]">
      <div className="flex h-full">
        {/* Stats */}
        <div className="flex flex-col justify-center gap-4 p-6 pr-0">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-white/[0.35]">Check-ins</p>
            <p className="text-4xl font-bold text-white">{count.toLocaleString()}</p>
          </div>
          {countryCount > 0 && (
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-widest text-white/[0.35]">Countries</p>
              <p className="text-4xl font-bold text-white">{countryCount}</p>
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

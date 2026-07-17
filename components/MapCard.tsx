import React, { useEffect } from 'react'
import { Map, useMap } from './ui/map'

function PulsingDot({ longitude, latitude }: { longitude: number; latitude: number }) {
  const { map, isLoaded } = useMap()

  useEffect(() => {
    if (!map || !isLoaded)
      return

    const size = 200
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8ClampedArray(size * size * 4),
      context: null as CanvasRenderingContext2D | null,

      onAdd() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        pulsingDot.context = canvas.getContext('2d')
      },

      render() {
        const duration = 1000
        const t = (performance.now() % duration) / duration
        const radius = (size / 2) * 0.3
        const outerRadius = (size / 2) * 0.7 * t + radius
        const ctx = pulsingDot.context
        if (!ctx)
          return false

        ctx.clearRect(0, 0, size, size)
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, outerRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 200, 200, ${1 - t})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 100, 100, 1)'
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2 + 4 * (1 - t)
        ctx.fill()
        ctx.stroke()

        pulsingDot.data = ctx.getImageData(0, 0, size, size).data
        map.triggerRepaint()
        return true
      },
    }

    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })
    map.addSource('dot-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [longitude, latitude] }, properties: {} }],
      },
    })
    map.addLayer({
      id: 'pulsing-dot-layer',
      type: 'symbol',
      source: 'dot-point',
      layout: { 'icon-image': 'pulsing-dot' },
    })

    return () => {
      try {
        if (map.getLayer('pulsing-dot-layer'))
          map.removeLayer('pulsing-dot-layer')
        if (map.getSource('dot-point'))
          map.removeSource('dot-point')
        if (map.hasImage('pulsing-dot'))
          map.removeImage('pulsing-dot')
      }
      catch {}
    }
  }, [map, isLoaded])

  return null
}

export function MapCard({ latitude, longitude, location }: { latitude: number; longitude: number; location: string }) {
  return (
    <Map center={[longitude, latitude]} zoom={12} className="relative h-full w-full">
      <PulsingDot longitude={longitude} latitude={latitude} />
      {!!location && (
        <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-[8px] bg-white/70 px-2 py-1.5 text-[14px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06)] backdrop-blur-[20px]">
          <div className="line-clamp-1 text-black">{location}</div>
        </div>
      )}
    </Map>
  )
}

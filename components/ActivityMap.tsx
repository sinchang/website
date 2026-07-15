import React, { useEffect, useMemo } from 'react'
import { Map, MapRoute, useMap } from './ui/map'

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

function ActivityOverlay({ coords }: { coords: [number, number][] }) {
  const { map, isLoaded } = useMap()

  useEffect(() => {
    if (!map || !isLoaded || coords.length < 2)
      return

    const longitudes = coords.map(c => c[0])
    const latitudes = coords.map(c => c[1])
    map.fitBounds(
      [
        [longitudes.reduce((a, b) => Math.min(a, b)), latitudes.reduce((a, b) => Math.min(a, b))],
        [longitudes.reduce((a, b) => Math.max(a, b)), latitudes.reduce((a, b) => Math.max(a, b))],
      ],
      { padding: 40, animate: false },
    )

    map.addSource('activity-start', {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'Point', coordinates: coords[0] }, properties: {} },
    })
    map.addLayer({
      id: 'activity-start',
      type: 'circle',
      source: 'activity-start',
      paint: { 'circle-radius': 6, 'circle-color': '#22c55e', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
    })

    map.addSource('activity-end', {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'Point', coordinates: coords[coords.length - 1] }, properties: {} },
    })
    map.addLayer({
      id: 'activity-end',
      type: 'circle',
      source: 'activity-end',
      paint: { 'circle-radius': 6, 'circle-color': '#ef4444', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
    })

    return () => {
      try {
        if (map.getLayer('activity-start'))
          map.removeLayer('activity-start')
        if (map.getSource('activity-start'))
          map.removeSource('activity-start')
        if (map.getLayer('activity-end'))
          map.removeLayer('activity-end')
        if (map.getSource('activity-end'))
          map.removeSource('activity-end')
      }
      catch {}
    }
  }, [map, isLoaded, coords])

  return null
}

export function ActivityMap({ polyline }: { polyline: string }) {
  const coords = useMemo(() => decodePolyline(polyline), [polyline])

  if (!coords.length)
    return <div className="h-full w-full" />

  const longitudes = coords.map(c => c[0])
  const latitudes = coords.map(c => c[1])
  const center: [number, number] = [
    (longitudes.reduce((a, b) => a + b)) / longitudes.length,
    (latitudes.reduce((a, b) => a + b)) / latitudes.length,
  ]

  return (
    <Map center={center} zoom={12} className="h-full w-full">
      <ActivityOverlay coords={coords} />
      <MapRoute coordinates={coords} color="#FF6464" width={3} opacity={1} />
    </Map>
  )
}

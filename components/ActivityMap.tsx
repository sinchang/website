/* eslint react/no-this-in-sfc: 0 */
import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

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
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1

    coords.push([lng / 1e5, lat / 1e5])
  }

  return coords
}

export function ActivityMap({ polyline }: { polyline: string }) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!polyline || !mapContainerRef.current || mapRef.current)
      return

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2luY2hhbmciLCJhIjoiY2x5cGlod2FsMDBmODJtcHQ4dHoydjRydyJ9.sorXWyvgNe7cSVX7OY2IYg'

    const coords = decodePolyline(polyline)
    if (coords.length === 0)
      return

    const lngs = coords.map(c => c[0])
    const lats = coords.map(c => c[1])
    const minLng = lngs.reduce((a, b) => Math.min(a, b))
    const maxLng = lngs.reduce((a, b) => Math.max(a, b))
    const minLat = lats.reduce((a, b) => Math.min(a, b))
    const maxLat = lats.reduce((a, b) => Math.max(a, b))

    const bounds = new mapboxgl.LngLatBounds([minLng, minLat], [maxLng, maxLat])

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      attributionControl: false,
      bounds,
      fitBoundsOptions: { padding: { top: 40, bottom: 40, left: 40, right: 40 } },
    })

    mapRef.current.on('load', () => {
      const map = mapRef.current!

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: coords },
          properties: {},
        },
      })

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#FF6464', 'line-width': 3 },
      })

      map.addSource('start-point', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'Point', coordinates: coords[0] }, properties: {} },
      })
      map.addLayer({
        id: 'start',
        type: 'circle',
        source: 'start-point',
        paint: { 'circle-radius': 6, 'circle-color': '#22c55e', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
      })

      map.addSource('end-point', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'Point', coordinates: coords[coords.length - 1] }, properties: {} },
      })
      map.addLayer({
        id: 'end',
        type: 'circle',
        source: 'end-point',
        paint: { 'circle-radius': 6, 'circle-color': '#ef4444', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' },
      })
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [polyline])

  return <div ref={mapContainerRef} className="h-full w-full" />
}

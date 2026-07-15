import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

function getMapStyle(): string {
  if (typeof document === 'undefined')
    return LIGHT_STYLE
  const root = document.documentElement
  const isDark = root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark'
  return isDark ? DARK_STYLE : LIGHT_STYLE
}

interface MapContextValue {
  map: maplibregl.Map | null
  isLoaded: boolean
}

const MapContext = createContext<MapContextValue>({ map: null, isLoaded: false })

export function useMap() {
  return useContext(MapContext)
}

export interface MapViewport {
  center: [number, number]
  zoom: number
  bearing?: number
  pitch?: number
}

interface MapProps {
  center?: [number, number]
  zoom?: number
  className?: string
  children?: React.ReactNode
}

export function Map({ center = [0, 0], zoom = 2, className, children }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [ctx, setCtx] = useState<MapContextValue>({ map: null, isLoaded: false })

  useEffect(() => {
    if (!containerRef.current || mapRef.current)
      return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getMapStyle(),
      center,
      zoom,
      attributionControl: false,
    })
    mapRef.current = map

    map.on('load', () => setCtx({ map, isLoaded: true }))

    // On theme change: unmount children so their cleanup removes old layers,
    // then remount once the new style is fully settled.
    let activeStyleUrl = getMapStyle()
    const observer = new MutationObserver(() => {
      const next = getMapStyle()
      if (activeStyleUrl === next)
        return
      activeStyleUrl = next
      setCtx({ map, isLoaded: false })
      map.setStyle(next)
      map.once('idle', () => setCtx({ map, isLoaded: true }))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    })

    return () => {
      observer.disconnect()
      map.remove()
      mapRef.current = null
      setCtx({ map: null, isLoaded: false })
    }
  }, [])

  return (
    <MapContext.Provider value={ctx}>
      <div ref={containerRef} className={className ?? 'h-full w-full'} />
      {ctx.isLoaded && children}
    </MapContext.Provider>
  )
}

interface MapRouteProps {
  coordinates: [number, number][]
  color?: string
  width?: number
  opacity?: number
}

export function MapRoute({ coordinates, color = '#4285F4', width = 3, opacity = 0.8 }: MapRouteProps) {
  const { map, isLoaded } = useMap()
  const id = useRef(`mapcn-route-${Math.random().toString(36).slice(2)}`).current

  useEffect(() => {
    if (!map || !isLoaded)
      return

    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates },
        properties: {},
      },
    })
    map.addLayer({
      id,
      type: 'line',
      source: id,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': color, 'line-width': width, 'line-opacity': opacity },
    })

    return () => {
      if (map.getLayer(id))
        map.removeLayer(id)
      if (map.getSource(id))
        map.removeSource(id)
    }
  }, [map, isLoaded])

  return null
}

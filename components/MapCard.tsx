/* eslint react/no-this-in-sfc: 0 */
import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export function MapCard({ latitude, longitude }: { latitude: number; longitude: number }) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2luY2hhbmciLCJhIjoiY2x5cGlod2FsMDBmODJtcHQ4dHoydjRydyJ9.sorXWyvgNe7cSVX7OY2IYg'

    if (mapRef.current)
      return

    mapRef.current = new mapboxgl.Map({
      container: 'map',
      center: [longitude, latitude],
      zoom: 12,
      style: 'mapbox://styles/mapbox/streets-v12',
      attributionControl: false,
    })

    const size = 200

    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd() {
        const canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        this.context = canvas.getContext('2d')
      },

      render() {
        const duration = 1000
        const t = (performance.now() % duration) / duration

        const radius = (size / 2) * 0.3
        const outerRadius = (size / 2) * 0.7 * t + radius
        const context = this.context

        context.clearRect(0, 0, this.width, this.height)
        context.beginPath()
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2,
        )
        context.fillStyle = `rgba(255, 200, 200, ${1 - t})`
        context.fill()

        context.beginPath()
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
        context.fillStyle = 'rgba(255, 100, 100, 1)'
        context.strokeStyle = 'white'
        context.lineWidth = 2 + 4 * (1 - t)
        context.fill()
        context.stroke()

        this.data = context.getImageData(0, 0, this.width, this.height).data

        if (mapRef.current)
          mapRef.current.triggerRepaint()

        return true
      },
    }

    mapRef.current.on('load', () => {
      if (mapRef.current)
        mapRef.current.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })

      mapRef.current?.addSource('dot-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              properties: null,
            },
          ],
        },
      })

      mapRef.current?.addLayer({
        id: 'layer-with-pulsing-dot',
        type: 'symbol',
        source: 'dot-point',
        layout: {
          'icon-image': 'pulsing-dot',
        },
      })
    })
  }, [])

  return <div id="map" ref={mapContainerRef} style={{ height: '200px', width: '100%' }}></div>
}

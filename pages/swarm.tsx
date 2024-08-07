// @ts-nocheck
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import initSqlJs from "sql.js";
import mapboxgl, { type Map } from 'mapbox-gl';
import path from 'path'

import 'mapbox-gl/dist/mapbox-gl.css';
import { SwarmInfo } from "../components/SwarmInfo";

export const getServerSideProps = (async () => {
  const sqlPromise = await initSqlJs({
    locateFile: file => path.resolve(process.cwd(), 'public', `${file}`)
  })
  const dataPromise = fetch("https://my-swarm.vercel.app/checkins.db", { next: { revalidate: 3600 } }).then(res => res.arrayBuffer());
  const [SQL, buffer] = await Promise.all([sqlPromise, dataPromise])
  const db = new SQL.Database(new Uint8Array(buffer));
  const res = db.exec("select venues.name, venues.country, venues.latitude, venues.longitude, venues.cc,venues.id from checkins INNER JOIN venues ON venues.id=checkins.venue order by created desc");

  const checkIns = []
  const places = []
  const countries = {}
  for (const item of res[0].values) {
    const [name, country, lat, lng, cc, id] = item
    checkIns.push({
      "type": "Feature",
      "properties": { name, country, cc, id },
      "geometry": { "type": "Point", "coordinates": [lng, lat] }
    })

    if (!places.includes(id)) {
      places.push(id)
    }

    if (countries[cc]) {
      countries[cc].checkInsCount++
      if (!countries[cc].places.includes(id)) {
        countries[cc].places.push(id)
      }
    } else {
      countries[cc] = {
        checkInsCount: 1,
        places: [id]
      }
    }
  }

  return { props: { checkIns, countries, places } }
})

const MyCheckIn: NextPage = ({ checkIns, countries, places }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!Array.isArray(checkIns)) return
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2luY2hhbmciLCJhIjoiY2x5cGlod2FsMDBmODJtcHQ4dHoydjRydyJ9.sorXWyvgNe7cSVX7OY2IYg';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [121.4737, 31.2304],
      zoom: 2,
      logoPosition: 'top-right',
      attributionControl: false,
    });

    mapRef.current.on('load', () => {
      mapRef.current.addSource('earthquakes', {
        type: 'geojson',
        data:
        {
          "type": "FeatureCollection",
          "features": checkIns
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      mapRef.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      mapRef.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      mapRef.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'earthquakes',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      // inspect a cluster on click
      mapRef.current.on('click', 'clusters', (e) => {
        const features = mapRef.current.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        mapRef.current
          .getSource('earthquakes')
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;

            mapRef.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          });
      });

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
      mapRef.current.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const name = e.features[0].properties.name;
        const country = e.features[0].properties.country

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`[${country}]: ${name}`)
          .addTo(mapRef.current);
      });

      mapRef.current.on('mouseenter', 'clusters', () => {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      });
      mapRef.current.on('mouseleave', 'clusters', () => {
        mapRef.current.getCanvas().style.cursor = '';
      });
    });

    return () => mapRef.current.remove();
  }, [checkIns]);



  return <div ref={mapContainerRef} id="map" style={{ height: '100%' }}>
    <SwarmInfo checkInCount={checkIns.length} placeCount={places.length} countryCount={Object.keys(countries).length} />
  </div>;
}

export default MyCheckIn

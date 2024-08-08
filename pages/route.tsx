// @ts-nocheck
import { NextPage } from "next"
import { useEffect, useRef } from "react"
import mapboxgl, { type Map } from 'mapbox-gl';
import * as turf from '@turf/turf'

import 'mapbox-gl/dist/mapbox-gl.css';

const FlightRoute: NextPage = ({ checkIns, countries, places }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2luY2hhbmciLCJhIjoiY2x5cGlod2FsMDBmODJtcHQ4dHoydjRydyJ9.sorXWyvgNe7cSVX7OY2IYg';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-96, 37.8],
      zoom: 3,
      pitch: 40
    });

   // San Francisco
   const origin = [121.3343, 31.1922];

   // Washington DC
   const destination = [121.2312, 25.0805];

   // A simple line from origin to destination.
   const route = {
       'type': 'FeatureCollection',
       'features': [
           {
               'type': 'Feature',
               'geometry': {
                   'type': 'LineString',
                   'coordinates': [origin, destination]
               }
           }
       ]
   };

   // A single point that animates along the route.
   // Coordinates are initially set to origin.
   const point = {
       'type': 'FeatureCollection',
       'features': [
           {
               'type': 'Feature',
               'properties': {},
               'geometry': {
                   'type': 'Point',
                   'coordinates': origin
               }
           }
       ]
   };

   // Calculate the distance in kilometers between route start/end point.
   const lineDistance = turf.length(route.features[0]);

   const arc = [];

   // Number of steps to use in the arc and animation, more steps means
   // a smoother arc and animation, but too many steps will result in a
   // low frame rate
   const steps = 400;

   // Draw an arc between the `origin` & `destination` of the two points
   for (let i = 0; i < lineDistance; i += lineDistance / steps) {
       const segment = turf.along(route.features[0], i);
       arc.push(segment.geometry.coordinates);
   }

   // Update the route with calculated arc coordinates
   route.features[0].geometry.coordinates = arc;

   // Used to increment the value of the point measurement against the route.
   let counter = 0;

   mapRef.current.on('load', () => {
       // Add a source and layer displaying a point which will be animated in a circle.
       mapRef.current.addSource('route', {
           'type': 'geojson',
           'data': route
       });

       mapRef.current.addSource('point', {
           'type': 'geojson',
           'data': point
       });

       mapRef.current.addLayer({
           'id': 'route',
           'source': 'route',
           'type': 'line',
           'paint': {
               'line-width': 2,
               'line-color': '#007cbf'
           }
       });

       mapRef.current.addLayer({
           'id': 'point',
           'source': 'point',
           'type': 'symbol',
           'layout': {
               // This icon is a part of the Mapbox Streets style.
               // To view all images available in a Mapbox style, open
               // the style in Mapbox Studio and click the "Images" tab.
               // To add a new image to the style at runtime see
               // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
               'icon-image': 'airport',
               'icon-size': 1.5,
               'icon-rotate': ['get', 'bearing'],
               'icon-rotation-alignment': 'map',
               'icon-allow-overlap': true,
               'icon-ignore-placement': true
           }
       });

       mapRef.current.jumpTo({ center: origin,zoom:4 });
       let running = false;
       function animate() {
           running = true;
          //  document?.getElementById('replay').disabled = true;
           const start =
               route.features[0].geometry.coordinates[
                   counter >= steps ? counter - 1 : counter
               ];
           const end =
               route.features[0].geometry.coordinates[
                   counter >= steps ? counter : counter + 1
               ];
           if (!start || !end) {
               running = false;
              //  document?.getElementById('replay').disabled = false;
               return;
           }
           // Update point geometry to a new position based on counter denoting
           // the index to access the arc
           point.features[0].geometry.coordinates =
               route.features[0].geometry.coordinates[counter];

           // Calculate the bearing to ensure the icon is rotated to match the route arc
           // The bearing is calculated between the current point and the next point, except
           // at the end of the arc, which uses the previous point and the current point
           point.features[0].properties.bearing = turf.bearing(
               turf.point(start),
               turf.point(end)
           );

           // Update the source with this new data
           mapRef.current.getSource('point').setData(point);

           // Request the next frame of animation as long as the end has not been reached
           if (counter < steps) {
               requestAnimationFrame(animate);
           }

           counter = counter + 1;
       }

      //  document?.getElementById('replay').addEventListener('click', () => {
      //      if (running) {
      //          void 0;
      //      } else {
      //          // Set the coordinates of the original point back to origin
      //          point.features[0].geometry.coordinates = origin;

      //          // Update the source layer
      //          mapRef.current.getSource('point').setData(point);

      //          // Reset the counter
      //          counter = 0;

      //          // Restart the animation
      //          animate(counter);
      //      }
      //  });

       // Start the animation
       animate(counter);
   });

    return () => mapRef.current.remove();
  }, []);



  return <div ref={mapContainerRef} id="map" style={{ height: '100%' }}>
  </div>;
}

export default FlightRoute

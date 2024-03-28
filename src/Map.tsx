import { useEffect, useRef } from 'react'
import Maplibregl, { Map as MapType } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const PROTON_MAPS_API_KEY = import.meta.env.VITE_PROTON_MAPS_API_KEY as string

import mapStyles from './Map.module.css'

export const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<null | MapType>(null)

  useEffect(() => {
    if (mapRef.current) return // stops map from intializing more than once

    mapRef.current = new Maplibregl.Map({
      container: mapContainer.current as HTMLElement,
      style: `https://api.protomaps.com/styles/v2/light.json?key=${PROTON_MAPS_API_KEY}`,
      center: [-3.236059, 53.183383],
      zoom: 5,
    })
  }, [])

  return (
    <div className={mapStyles.mapWrapper}>
      <div ref={mapContainer} className={mapStyles.map} />
    </div>
  )
}

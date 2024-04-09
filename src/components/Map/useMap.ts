import { useEffect, useRef } from 'react'
import Maplibregl, { Map as MaplibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const PROTON_MAPS_API_KEY = import.meta.env.VITE_PROTON_MAPS_API_KEY as string

export const useMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MaplibreMap>()

  useEffect(function initializeMap() {
    if (mapRef.current) return // stops map from intializing more than once

    mapRef.current = new Maplibregl.Map({
      container: mapContainer.current as HTMLElement,
      style: `https://api.protomaps.com/styles/v2/light.json?key=${PROTON_MAPS_API_KEY}`,
      center: [-118.805, 34.027],
      zoom: 14,
    })
  }, [])

  return {
    mapContainer,
    mapInstance: mapRef.current,
  }
}

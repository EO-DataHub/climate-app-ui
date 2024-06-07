import { useEffect, useRef, useState } from 'react'
import Maplibregl, { Map as MaplibreMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const PROTON_MAPS_API_KEY = import.meta.env.VITE_PROTON_MAPS_API_KEY as string

export const useMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MaplibreMap>()
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [firstLabelsLayerId, setFirstLabelsLayerId] = useState<
    string | undefined
  >()

  useEffect(function initializeMap() {
    if (mapRef.current) return // stops map from intializing more than once

    mapRef.current = new Maplibregl.Map({
      container: mapContainer.current as HTMLElement,
      style: `https://api.protomaps.com/styles/v2/white.json?key=${PROTON_MAPS_API_KEY}`,
      center: [0, 0],
      zoom: 1,
    })
  }, [])

  useEffect(
    function initializeIsMapLoaded() {
      if (!mapRef.current) return

      const initializeLabelLayersId = () => {
        let firstLayerId
        const layers = mapRef.current?.getStyle().layers
        if (!layers?.length) return

        for (const layer of layers) {
          if (layer.type === 'symbol') {
            firstLayerId = layer.id
            break
          }
        }

        setFirstLabelsLayerId(firstLayerId)
      }

      const handleMapLoad = () => {
        initializeLabelLayersId()
        setIsMapLoaded(true)
      }

      mapRef.current?.on('load', handleMapLoad)

      const mapInstance = mapRef.current

      return () => {
        mapInstance.off('load', handleMapLoad)
      }
    },
    [mapRef],
  )

  return {
    firstLabelsLayerId,
    isMapLoaded,
    mapContainer,
    mapRef,
  }
}

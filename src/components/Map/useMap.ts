import Maplibregl, {
  FullscreenControl,
  Map as MaplibreMap,
  NavigationControl,
  StyleSpecification,
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MutableRefObject, useEffect, useRef, useState } from 'react'

import { MAP_MAX_ZOOM, MapSourceIds } from '../../configuration/constants'

export type MapRef = MutableRefObject<MaplibreMap | null | undefined>

const mapStyleSpec: StyleSpecification = {
  version: 8,
  name: 'Custom Style',
  glyphs:
    'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf', // this is a hack to make map fonts work (map cluster counts). Protomaps may block us at some point, and there is a ticket to have a more stable solution here https://github.com/sparkgeo/uk_eodatahub/issues/245
  sources: {
    [MapSourceIds.BASEMAP]: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
    },
  },
  layers: [
    {
      id: MapSourceIds.BASEMAP,
      type: 'raster',
      source: MapSourceIds.BASEMAP,
      minzoom: 0,
      maxzoom: MAP_MAX_ZOOM,
    },
  ],
}

export const useMap = (initialConfig?: {
  center?: [number, number]
  zoom?: number
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MaplibreMap>()
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(
    function initializeMapInstance() {
      if (mapRef.current) return // stops map from intializing more than once

      const center = initialConfig?.center ?? [0, 0] // Default center
      const zoom = initialConfig?.zoom ?? 1 // Default zoom

      mapRef.current = new Maplibregl.Map({
        container: mapContainer.current as HTMLElement,
        style: mapStyleSpec,
        center: center,
        zoom: zoom,
        maxZoom: MAP_MAX_ZOOM,
      })

      mapRef.current.addControl(new NavigationControl())
      mapRef.current.addControl(new FullscreenControl())
    },
    [initialConfig],
  )

  useEffect(
    function initializeIsMapLoaded() {
      if (!mapRef.current) return

      const handleMapLoad = () => {
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
    isMapLoaded,
    mapContainer,
    mapRef,
  }
}

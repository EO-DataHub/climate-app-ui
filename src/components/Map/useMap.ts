import { MutableRefObject, useEffect, useRef, useState } from 'react'
import Maplibregl, { Map as MaplibreMap, StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { MAP_MAX_ZOOM, MapSourceIds } from '../../constants'

export type MapRef = MutableRefObject<MaplibreMap | null | undefined>

const mapStyleSpec: StyleSpecification = {
  version: 8,
  name: 'Custom Style',
  glyphs:
    'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf', // this is a hack to make map fonts work (map cluster counts). Protomaps may block us at some point, and there is a ticket to have a more stable solution here https://github.com/sparkgeo/uk_eodatahub/issues/245
  sources: {
    [MapSourceIds.BASEMAP]: {
      type: 'raster',
      tiles: [
        'http://s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg',
      ],
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

export const useMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MaplibreMap>()
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(function initializeMap() {
    if (mapRef.current) return // stops map from intializing more than once

    mapRef.current = new Maplibregl.Map({
      container: mapContainer.current as HTMLElement,
      style: mapStyleSpec,
      center: [0, 0],
      zoom: 1,
      maxZoom: MAP_MAX_ZOOM,
    })
  }, [])

  useEffect(
    function initializeMap() {
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

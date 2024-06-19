import { MutableRefObject, useEffect, useRef, useState } from 'react'
import Maplibregl, { Map as MaplibreMap, StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import { MAP_MAX_ZOOM, MapLayerIds, MapSourceIds } from '../../constants'

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
        'http://s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg',
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

      const addBasemapOverlays = () => {
        if (!mapRef.current) return

        mapRef.current.addSource(
          MapSourceIds.BASEMAP_OVERLAY_BOUNDARIES_LABELS,
          {
            type: 'raster',
            tiles: [
              'http://s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg',
            ],
          },
        )

        mapRef.current.addLayer({
          id: MapLayerIds.BASEMAP_OVERLAY_BOUNDARIES_LABELS,
          type: 'raster',
          source: MapSourceIds.BASEMAP_OVERLAY_BOUNDARIES_LABELS,
        })
      }

      const handleMapLoad = () => {
        setIsMapLoaded(true)
        addBasemapOverlays()
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

import { Dispatch, SetStateAction, useEffect } from 'react'
import {
  MapSourceIds,
  OBSERVATIONS_LAYER_INITIAL_OPACITY,
} from '../../../configuration/constants'
import { RasterTileSource } from 'maplibre-gl'
import { MapRef } from '../../Map/useMap'

const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL

export const useUpdateObservationsMapTiles = ({
  isMapLoaded,
  mapRef,
  maxTemp,
  minTemp,
  selectedObservationLayerUrl,
  use_cog_urls,
  setIsMapLoading,
}: {
  isMapLoaded: boolean
  mapRef: MapRef
  maxTemp: string
  minTemp: string
  selectedObservationLayerUrl: string
  use_cog_urls: boolean
  setIsMapLoading: Dispatch<SetStateAction<boolean>> | undefined
}) => {
  useEffect(
    function updateObservationsMapTiles() {
      if (!isMapLoaded || !mapRef.current || !setIsMapLoading) {
        return
      }
      setIsMapLoading(true)
      void mapRef.current.once('idle', () => setIsMapLoading(false))
      const observationsSource = mapRef.current.getSource(
        MapSourceIds.OBSERVATIONS,
      ) as RasterTileSource
      const titilerUrl = use_cog_urls
        ? `${HUB_BASE_URL}/titiler/core/cog/tiles/WebMercatorQuad/{z}/{x}/{y}.png?url=${selectedObservationLayerUrl}&rescale=${minTemp},${maxTemp}&colormap_name=jet`
        : `${HUB_BASE_URL}/titiler/xarray/tiles/{z}/{x}/{y}?url=${selectedObservationLayerUrl}&rescale=${parseFloat(minTemp) + 273.15},${parseFloat(maxTemp) + 273.15}&colormap_name=jet&variable=lst&tileMatrixSetId=WebMercatorQuad&scale=1&multiscale=false&reference=true&decode_times=true&consolidated=false&return_mask=true`
      if (!observationsSource) {
        mapRef.current.addSource(MapSourceIds.OBSERVATIONS, {
          type: 'raster',
          tiles: [titilerUrl],
          tileSize: 256,
        })
      }
      if (observationsSource) {
        observationsSource.setTiles([titilerUrl])
      }
      const observationsLayer = mapRef.current.getLayer(
        MapSourceIds.OBSERVATIONS,
      )
      const userAssetsLayer = mapRef.current.getLayer(MapSourceIds.USER_ASSETS)
      const layerIdToLoadObservationsBelow = userAssetsLayer
        ? userAssetsLayer.id
        : undefined
      if (!observationsLayer) {
        mapRef.current.addLayer(
          {
            id: MapSourceIds.OBSERVATIONS,
            type: 'raster',
            source: MapSourceIds.OBSERVATIONS,
            paint: { 'raster-opacity': OBSERVATIONS_LAYER_INITIAL_OPACITY },
          },
          layerIdToLoadObservationsBelow,
        )
      }
    },
    [
      isMapLoaded,
      mapRef,
      maxTemp,
      minTemp,
      selectedObservationLayerUrl,
      setIsMapLoading,
      use_cog_urls,
    ],
  )
}

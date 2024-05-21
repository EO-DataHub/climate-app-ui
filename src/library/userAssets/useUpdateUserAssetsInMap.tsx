import {
  LngLatBoundsLike,
  MapLayerMouseEvent,
  Map as MaplibreMap,
  Popup,
} from 'maplibre-gl'
// @ts-expect-error  turf has an issue delaring its types
import { bbox as turfBbox } from '@turf/turf'
import { useContext } from 'react'

import { Badge, Button, DataList, Text } from '@radix-ui/themes'
import { LoadingContext } from '../../context/LoadingContext'
import { renderToString } from 'react-dom/server'
import { UserAssets } from '../../context/UserAssetsContext'
import assetsPopupStyles from './AssetsPopup.module.scss'

export const useUpdateUserAssetsInMap = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<MaplibreMap | undefined>
}) => {
  const { setIsLoading } = useContext(LoadingContext)
  const cssStyles = window.getComputedStyle(document.body)

  const removeUserAssetsFromMap = () => {
    if (!mapRef.current || !setIsLoading) return

    setIsLoading(true)

    void mapRef.current.once('idle', () => {
      setIsLoading(false)
    })

    mapRef.current.removeSource('userAssets')
    mapRef.current.removeLayer('userAssetsClusters')
    mapRef.current.removeLayer('userAssetsUnclustered')
    mapRef.current.removeLayer('clusterCount')
  }

  const updateUserAssetsInMap = (userAssets: UserAssets) => {
    if (!mapRef.current || !userAssets || !setIsLoading) return

    setIsLoading(true)

    void mapRef.current.once('idle', () => {
      setIsLoading(false)
    })

    const userAssetBounds = turfBbox(userAssets) as LngLatBoundsLike
    const userAssetsSource = mapRef.current.getSource(
      'userAssets',
    ) as maplibregl.GeoJSONSource
    const userAssetsClustersLayer =
      mapRef.current.getLayer('userAssetsClusters')
    const userAssetsUnclusteredLayer = mapRef.current.getLayer(
      'userAssetsUnclustered',
    )
    const userAssetsCountLayer = mapRef.current.getLayer('clusterCount')
    const handleMarkerClusterClick = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0]

      if (!feature) return

      const clusterId = feature.properties.cluster_id

      userAssetsSource ??
        (mapRef.current!.getSource('userAssets') as maplibregl.GeoJSONSource)
          .getClusterExpansionZoom(clusterId)
          .then((zoom: number) => {
            mapRef.current!.easeTo({
              // @ts-expect-error - maplibre-gl types are contradictory with docs
              center: feature.geometry.coordinates,
              zoom: zoom,
            })
          })
          .catch(() => {
            mapRef.current!.easeTo({
              // @ts-expect-error - maplibre-gl types are contradictory with docs
              center: feature.geometry.coordinates,
              zoom: mapRef.current!.getZoom() + 2,
            })
          })
    }
    const handleMarkerClick = (event: MapLayerMouseEvent) => {
      // @ts-expect-error - maplibre-gl types are contradictory with docs
      const coordinates = event.features?.[0].geometry.coordinates.slice()
      const assetVulnerability =
        event.features?.[0].properties.assetVulnerability
      const assetType = event.features?.[0].properties.assetType

      // Ensure popup appears over correct world 'copy'
      while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360
      }

      const popupContent = (
        <div className={assetsPopupStyles.assetsPopupContent}>
          <Text size="2">
            Data for this asset is currently being processed or is unavailable.
          </Text>
          <DataList.Root
            orientation={{ initial: 'vertical', sm: 'horizontal' }}
          >
            <DataList.Item>
              <DataList.Label>Asset Vulnerability</DataList.Label>
              <DataList.Value>
                {assetVulnerability ? (
                  assetVulnerability
                ) : (
                  <Badge variant="soft" color="gray">
                    Data Unavailable
                  </Badge>
                )}
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Asset Type</DataList.Label>
              <DataList.Value>
                {assetType ? (
                  assetType
                ) : (
                  <Badge variant="soft" color="gray">
                    Data Unavailable
                  </Badge>
                )}
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
          <Button disabled>View Detailed Analysis</Button>
        </div>
      )

      new Popup()
        .setLngLat(coordinates)
        .setHTML(renderToString(popupContent))
        .addTo(mapRef.current!)
    }
    const handleMarkerMouseEnter = () => {
      mapRef.current!.getCanvas().style.cursor = 'pointer'
    }
    const handleMarkerMouseLeave = () => {
      mapRef.current!.getCanvas().style.cursor = ''
    }
    const largeClusterColor = cssStyles.getPropertyValue(
      '--large-marker-cluster-color',
    )
    const mediumClusterColor = cssStyles.getPropertyValue(
      '--medium-marker-cluster-color',
    )
    const smallClusterColor = cssStyles.getPropertyValue(
      '--small-marker-cluster-color',
    )
    const unclusteredColor = cssStyles.getPropertyValue(
      '--unclustered-marker-color',
    )
    const markerStrokeColor = cssStyles.getPropertyValue(
      '--marker-stroke-color',
    )

    mapRef.current.fitBounds(userAssetBounds)

    if (userAssetsSource) {
      userAssetsSource.setData(userAssets)
    }

    if (!userAssetsSource) {
      mapRef.current.addSource('userAssets', {
        type: 'geojson',
        data: userAssets,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })
    }

    if (!userAssetsClustersLayer) {
      mapRef.current.addLayer({
        id: 'userAssetsClusters',
        type: 'circle',
        source: 'userAssets',
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            smallClusterColor,
            100,
            mediumClusterColor,
            750,
            largeClusterColor,
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': markerStrokeColor,
        },
        filter: ['has', 'point_count'],
      })
      mapRef.current.on('click', 'userAssetsClusters', handleMarkerClusterClick)
    }
    if (!userAssetsCountLayer) {
      mapRef.current.addLayer({
        id: 'clusterCount',
        type: 'symbol',
        source: 'userAssets',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Noto Sans Regular'],
          'text-size': 12,
        },
      })
    }

    if (!userAssetsUnclusteredLayer) {
      mapRef.current.addLayer({
        id: 'userAssetsUnclustered',
        type: 'circle',
        source: 'userAssets',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': unclusteredColor,
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': markerStrokeColor,
        },
      })

      mapRef.current.on('click', 'userAssetsUnclustered', handleMarkerClick)
      mapRef.current.on(
        'mouseenter',
        'userAssetsUnclustered',
        handleMarkerMouseEnter,
      )
      mapRef.current.on(
        'mouseleave',
        'userAssetsUnclustered',
        handleMarkerMouseLeave,
      )
    }
  }

  return { updateUserAssetsInMap, removeUserAssetsFromMap }
}

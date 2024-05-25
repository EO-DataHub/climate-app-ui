import {
  LngLatBoundsLike,
  MapLayerMouseEvent,
  Map as MaplibreMap,
  Popup,
} from 'maplibre-gl'
// @ts-expect-error  turf has an issue delaring its types
import { bbox as turfBbox } from '@turf/turf'
import { useCallback, useContext } from 'react'

import { Badge, Button, DataList, Text } from '@radix-ui/themes'
import { LoadingContext } from '../../context/LoadingContext'
import { renderToString } from 'react-dom/server'
import { UserAssets, UserAssetsContext } from '../../context/UserAssetsContext'
import assetsPopupStyles from './AssetsPopup.module.scss'
import { ASSET_SELSECT_UNSAVED_ASSETS_VALUE } from '../../constants'
import { AssetVulnerabilityBadge } from '../../components/AssetVulnerabilityBadge/AssetVulnerabilityBadge'

export const useUpdateUserAssetsInMap = ({
  mapRef,
}: {
  mapRef: React.MutableRefObject<MaplibreMap | undefined>
}) => {
  const { setIsLoading } = useContext(LoadingContext)
  const { userAssets } = useContext(UserAssetsContext)

  const removeUserAssetsFromMap = useCallback(() => {
    if (!mapRef.current || !setIsLoading) return

    setIsLoading(true)

    void mapRef.current.once('idle', () => {
      setIsLoading(false)
    })

    mapRef.current.removeSource('userAssets')
    mapRef.current.removeLayer('userAssetsClusters')
    mapRef.current.removeLayer('userAssetsUnclustered')
    mapRef.current.removeLayer('clusterCount')
  }, [setIsLoading, mapRef])

  const updateUserAssetsInMap = useCallback(
    (userAssets: UserAssets) => {
      if (!mapRef.current || !userAssets || !setIsLoading) return

      const cssStyles = window.getComputedStyle(document.body)

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
        const assetVulnerability = event.features?.[0].properties.vulnerability
        const assetType = event.features?.[0].properties.assetType

        // Ensure popup appears over correct world 'copy'
        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360
        }

        const popupContent = (
          <div className={assetsPopupStyles.assetsPopupContent}>
            {!assetVulnerability ? (
              <Text size="2">
                Data for this asset is currently being processed or is
                unavailable.
              </Text>
            ) : null}
            <DataList.Root
              orientation={{ initial: 'vertical', sm: 'horizontal' }}
            >
              <DataList.Item>
                <DataList.Label>Asset Vulnerability</DataList.Label>
                <DataList.Value>
                  <AssetVulnerabilityBadge vulnerability={assetVulnerability} />
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
            {!assetVulnerability ? (
              <Button disabled>View Detailed Analysis</Button>
            ) : null}
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

      const lowAssetRiskColor = cssStyles.getPropertyValue(
        '--low-asset-risk-color',
      )

      const mediumAssetRiskColor = cssStyles.getPropertyValue(
        '--medium-asset-risk-color',
      )
      const highAssetRiskColor = cssStyles.getPropertyValue(
        '--high-asset-risk-color',
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
        mapRef.current.on(
          'click',
          'userAssetsClusters',
          handleMarkerClusterClick,
        )
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
            // 'circle-color': unclusteredColor,
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': markerStrokeColor,
            'circle-color': [
              'match',
              ['get', 'vulnerability'],
              'High',
              highAssetRiskColor,
              'Medium',
              mediumAssetRiskColor,
              'Low',
              lowAssetRiskColor,
              unclusteredColor,
            ],
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
    },
    [mapRef, setIsLoading],
  )

  const updateSelectedAssetsOnMap = useCallback(
    (portfolioName: string) => {
      if (!portfolioName) {
        removeUserAssetsFromMap()
        return
      }

      if (userAssets && portfolioName == ASSET_SELSECT_UNSAVED_ASSETS_VALUE) {
        // right now we only have one possible portfolio called userAssets that come from a file the user just opened. We'll figure out better naming later.
        updateUserAssetsInMap(userAssets)
      }
    },
    [removeUserAssetsFromMap, updateUserAssetsInMap, userAssets],
  )

  return {
    updateUserAssetsInMap,
    removeUserAssetsFromMap,
    updateSelectedAssetsOnMap,
  }
}

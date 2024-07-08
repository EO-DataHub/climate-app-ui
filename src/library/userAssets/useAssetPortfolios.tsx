import { MapLayerMouseEvent, Popup } from 'maplibre-gl'
// @ts-expect-error  turf has an issue delaring its types
import { bbox as turfBbox } from '@turf/turf'
import { useCallback, useContext } from 'react'

import { Badge, Button, DataList, Text } from '@radix-ui/themes'
import { LoadingContext } from '../../context/LoadingContext'
import { renderToString } from 'react-dom/server'
import { UserAssetsContext } from '../../context/UserAssetsContext'
import assetsPopupStyles from './AssetsPopup.module.scss'
import {
  MAPLIBRE_FIT_BOUNDS_PADDING,
  MapLayerIds,
  MapSourceIds,
  UNSAVED_PORTFOLIO_VALUE_FOR_SELECT_INPUT,
} from '../../constants'
import { AssetVulnerabilityBadge } from '../../components/AssetVulnerabilityBadge/AssetVulnerabilityBadge'
import { areBoundsValid } from '../maplibre/isGeometryValid'
import { MapRef } from '../../components/Map/useMap'
import { UserAssets } from './userAssetTypes'

export const useAssetPortfolios = ({
  mapRef,
  isMapLoaded,
}: {
  mapRef: MapRef
  isMapLoaded: boolean
}) => {
  const { setIsLoading } = useContext(LoadingContext)
  const { userAssets } = useContext(UserAssetsContext)

  const removeUserAssetsFromMap = useCallback(() => {
    if (!mapRef.current || !setIsLoading) return

    setIsLoading(true)

    void mapRef.current.once('idle', () => {
      setIsLoading(false)
    })

    mapRef.current.removeSource(MapSourceIds.USER_ASSETS)
    mapRef.current.removeLayer(MapLayerIds.USER_ASSETS_CLUSTERED)
    mapRef.current.removeLayer(MapLayerIds.USER_ASSETS_UNCLUSTERED)
    mapRef.current.removeLayer(MapLayerIds.USER_ASSETS_CLUSTER_COUNT)
  }, [setIsLoading, mapRef])

  const updateUserAssetsInMap = useCallback(
    (userAssets: UserAssets) => {
      if (!mapRef.current || !userAssets || !setIsLoading || !isMapLoaded)
        return

      const cssStyles = window.getComputedStyle(document.body)

      setIsLoading(true)

      void mapRef.current.once('idle', () => {
        setIsLoading(false)
      })

      const userAssetBounds = turfBbox(userAssets)
      const userAssetsSource = mapRef.current.getSource(
        MapSourceIds.USER_ASSETS,
      ) as maplibregl.GeoJSONSource
      const userAssetsClustersLayer = mapRef.current.getLayer(
        MapLayerIds.USER_ASSETS_CLUSTERED,
      )
      const userAssetsUnclusteredLayer = mapRef.current.getLayer(
        MapLayerIds.USER_ASSETS_UNCLUSTERED,
      )
      const userAssetsCountLayer = mapRef.current.getLayer(
        MapLayerIds.USER_ASSETS_CLUSTER_COUNT,
      )
      const handleMarkerClusterClick = (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0]

        if (!feature) return

        const clusterId = feature.properties.cluster_id

        userAssetsSource ??
          (
            mapRef.current!.getSource(
              MapSourceIds.USER_ASSETS,
            ) as maplibregl.GeoJSONSource
          )
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
        if (!mapRef.current) return
        // @ts-expect-error - maplibre-gl types are contradictory with docs
        const coordinates = event.features?.[0].geometry.coordinates.slice()
        const assetVulnerability = event.features?.[0].properties.vulnerability
        const assetType = event.features?.[0].properties.assetType
        const itemId = event.features?.[0].properties.id

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
                <DataList.Label>Item Id</DataList.Label>
                <DataList.Value>{itemId}</DataList.Value>
              </DataList.Item>
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
          .addTo(mapRef.current)
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

      const markerStrokeColorSelected = cssStyles.getPropertyValue(
        '--marker-stroke-color-selected',
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

      const areUserAssetBoundsValid = areBoundsValid(userAssetBounds)
      if (areUserAssetBoundsValid) {
        mapRef.current.fitBounds(userAssetBounds, {
          padding: MAPLIBRE_FIT_BOUNDS_PADDING,
        })
      }
      if (!areUserAssetBoundsValid) {
        mapRef.current.setZoom(1)
        mapRef.current.setCenter([0, 0])
      }

      if (userAssetsSource) {
        userAssetsSource.setData(userAssets)
      }

      if (!userAssetsSource) {
        mapRef.current.addSource(MapSourceIds.USER_ASSETS, {
          type: 'geojson',
          data: userAssets,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
          promoteId: 'id', // necessary to use for table selection styling via setFeatureState
        })
      }

      if (!userAssetsClustersLayer) {
        mapRef.current.addLayer({
          id: MapLayerIds.USER_ASSETS_CLUSTERED,
          type: 'circle',
          source: MapSourceIds.USER_ASSETS,
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
            'circle-stroke-width': 2,
            'circle-stroke-color': markerStrokeColor,
          },
          filter: ['has', 'point_count'],
        })
        mapRef.current.on(
          'click',
          MapLayerIds.USER_ASSETS_CLUSTERED,
          handleMarkerClusterClick,
        )
      }
      if (!userAssetsCountLayer) {
        mapRef.current.addLayer({
          id: MapLayerIds.USER_ASSETS_CLUSTER_COUNT,
          type: 'symbol',
          source: MapSourceIds.USER_ASSETS,
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
          id: MapLayerIds.USER_ASSETS_UNCLUSTERED,
          type: 'circle',
          source: MapSourceIds.USER_ASSETS,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': [
              'case',
              ['==', ['feature-state', 'isSelected'], true],
              4.5,
              4,
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': [
              'case',
              ['==', ['feature-state', 'isSelected'], true],
              markerStrokeColorSelected,
              markerStrokeColor,
            ],
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

        mapRef.current.on(
          'click',
          MapLayerIds.USER_ASSETS_UNCLUSTERED,
          handleMarkerClick,
        )
        mapRef.current.on(
          'mouseenter',
          MapLayerIds.USER_ASSETS_UNCLUSTERED,
          handleMarkerMouseEnter,
        )
        mapRef.current.on(
          'mouseleave',
          MapLayerIds.USER_ASSETS_UNCLUSTERED,
          handleMarkerMouseLeave,
        )
      }
    },
    [isMapLoaded, mapRef, setIsLoading],
  )

  const updateCurrentPortfolioShown = useCallback(
    (portfolioName: string) => {
      if (!portfolioName) {
        removeUserAssetsFromMap()
        return
      }

      if (
        userAssets &&
        portfolioName == UNSAVED_PORTFOLIO_VALUE_FOR_SELECT_INPUT
      ) {
        // right now we only have one possible portfolio called userAssets that come from a file the user just opened. We'll figure out better naming later.
        updateUserAssetsInMap(userAssets)
      }
    },
    [removeUserAssetsFromMap, updateUserAssetsInMap, userAssets],
  )

  return {
    updateUserAssetsInMap,
    removeUserAssetsFromMap,
    updateCurrentPortfolioShown,
  }
}

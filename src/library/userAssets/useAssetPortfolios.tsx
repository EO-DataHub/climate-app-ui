import { Badge, DataList, Link, Separator } from '@radix-ui/themes'
// @ts-expect-error  turf has an issue delaring its types
import { bbox as turfBbox } from '@turf/turf'
import { MapLayerMouseEvent, Popup } from 'maplibre-gl'
import { useCallback, useContext } from 'react'
import ReactDOM from 'react-dom/client'

import {
  MAPLIBRE_FIT_BOUNDS_PADDING,
  MapLayerIds,
  MapSourceIds,
  UNSAVED_PORTFOLIO_VALUE_FOR_SELECT_INPUT,
} from '../../configuration/constants'

import { areBoundsValid } from '../maplibre/isGeometryValid'
import { AssetVulnerabilityBadge } from '../../components/AssetVulnerabilityBadge/AssetVulnerabilityBadge'
import { LoadingContext } from '../../context/LoadingContext'
import { MapRef } from '../../components/Map/useMap'
import { UserAssets } from './userAssetTypes'
import { UserAssetsContext } from '../../context/UserAssetsContext'
import assetsPopupStyles from './AssetsPopup.module.scss'

export const useAssetPortfolios = ({
  isMapLoaded,
  mapRef,
  onHighlightInTableClick,
  onMapMarkerPopupClose,
  onAssetMarkerClick,
  zoomToUserAssets = true,
}: {
  isMapLoaded: boolean | undefined
  mapRef: MapRef | undefined
  onHighlightInTableClick?: (id: string) => void
  onMapMarkerPopupClose?: () => void
  onAssetMarkerClick?: (event: MapLayerMouseEvent) => void
  zoomToUserAssets?: boolean
}) => {
  const { setIsMapLoading } = useContext(LoadingContext)
  const { userAssets } = useContext(UserAssetsContext)

  const removeUserAssetsFromMap = useCallback(() => {
    if (!mapRef?.current || !setIsMapLoading) return

    setIsMapLoading(true)

    void mapRef.current.once('idle', () => {
      setIsMapLoading(false)
    })

    mapRef.current.removeSource(MapSourceIds.USER_ASSETS)
    mapRef.current.removeLayer(MapLayerIds.USER_ASSETS_CLUSTERED)
    mapRef.current.removeLayer(MapLayerIds.USER_ASSETS_UNCLUSTERED)
    mapRef.current.removeLayer(MapLayerIds.USER_ASSETS_CLUSTER_COUNT)
  }, [setIsMapLoading, mapRef])

  const updateUserAssetsInMap = useCallback(
    (userAssets: UserAssets) => {
      if (!mapRef?.current || !userAssets || !setIsMapLoading || !isMapLoaded)
        return

      const cssStyles = window.getComputedStyle(document.body)

      setIsMapLoading(true)

      void mapRef.current.once('idle', () => {
        setIsMapLoading(false)
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
        const assetCategory = event.features?.[0].properties.assetCategory
        const itemId = event.features?.[0].properties.id

        const adjustedCoordinates = [...coordinates]
        // Ensure popup appears over correct world 'copy'
        while (Math.abs(event.lngLat.lng - adjustedCoordinates[0]) > 180) {
          adjustedCoordinates[0] +=
            event.lngLat.lng > adjustedCoordinates[0] ? 360 : -360
        }

        const popupContent = (
          <div className={assetsPopupStyles.assetsPopupContent}>
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
                <DataList.Label>ID</DataList.Label>
                <DataList.Value>{itemId}</DataList.Value>
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
              <DataList.Item>
                <DataList.Label>Asset Category</DataList.Label>
                <DataList.Value>
                  {assetCategory ? (
                    assetCategory
                  ) : (
                    <Badge variant="soft" color="gray">
                      Data Unavailable
                    </Badge>
                  )}
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Latitude</DataList.Label>
                <DataList.Value>
                  {adjustedCoordinates[1].toFixed(4)}°
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Longitude</DataList.Label>
                <DataList.Value>
                  {adjustedCoordinates[0].toFixed(4)}°
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>

            {onHighlightInTableClick ? (
              <>
                <Separator size="4" />
                <div className={assetsPopupStyles.assetsPopupActionRow}>
                  <Link asChild>
                    <button
                      onClick={() => {
                        onHighlightInTableClick(itemId)
                      }}
                    >
                      Highlight in Table
                    </button>
                  </Link>{' '}
                </div>
              </>
            ) : null}
          </div>
        )

        const popupContentHack = document.createElement('div')
        ReactDOM.createRoot(popupContentHack).render(popupContent)
        new Popup()
          .setDOMContent(popupContentHack)
          .setLngLat(coordinates)
          .addTo(mapRef.current)
          .on('close', () => {
            onMapMarkerPopupClose?.()
          })
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
      if (areUserAssetBoundsValid && zoomToUserAssets) {
        mapRef.current.fitBounds(userAssetBounds, {
          padding: MAPLIBRE_FIT_BOUNDS_PADDING,
        })
      }
      if (!areUserAssetBoundsValid && zoomToUserAssets) {
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
              30,
              100,
              40,
              750,
              50,
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
            'text-font': ['Noto Sans Medium'],
            'text-size': 12,
          },
          paint: {
            'text-color': markerStrokeColor,
            'text-halo-color': markerStrokeColor,
            'text-halo-width': 0.3, // to achieve 'bold'
            'text-halo-blur': 0,
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
              12.5,
              12,
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

        const markerClickHandlerToUse = onAssetMarkerClick ?? handleMarkerClick
        mapRef.current.on(
          'click',
          MapLayerIds.USER_ASSETS_UNCLUSTERED,
          markerClickHandlerToUse,
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
    [
      isMapLoaded,
      mapRef,
      onAssetMarkerClick,
      onHighlightInTableClick,
      onMapMarkerPopupClose,
      setIsMapLoading,
      zoomToUserAssets,
    ],
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

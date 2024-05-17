import { Button, Heading, Select, Separator, Text } from '@radix-ui/themes'

import {
  climateModelOptions,
  indicatorOptions,
  scenarioOptions,
  yearOptions,
} from '../../../library/api/fakeApiData'
import { ASSET_SELSECT_UNSAVED_ASSETS_VALUE } from '../../../constants'
import { AssetsSelect } from '../../AssetsSelect'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { LoadingContext } from '../../../context/LoadingContext'
import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { RasterTileSource } from 'maplibre-gl'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useMap } from '../../Map/useMap'
import { useNavigate } from 'react-router-dom'
import { UserAssetsContext } from '../../../context/UserAssetsContext'
import { useUpdateUserAssetsInMap } from '../../../library/userAssets/useUpdateUserAssetsInMap'
import containerStyles from '../../../library/genericStyles/containers.module.css'
import hazardsStyles from './Hazards.module.css'

enum MapSourceIds {
  HAZARD_DATA = 'hazard-data',
}

export const Hazards = () => {
  const [hazardIndicator, setHazardIndicator] = useState(
    indicatorOptions[0].value,
  )
  const [climateModel, setClimateModel] = useState(climateModelOptions[0].value)
  const [scenario, setScenario] = useState(scenarioOptions[0].value)
  const [year, setYear] = useState(yearOptions[0])
  const { mapContainer, mapRef, isMapLoaded, firstLabelsLayerId } = useMap()
  const { setIsLoading } = useContext(LoadingContext)
  const { updateUserAssetsInMap, removeUserAssetsFromMap } =
    useUpdateUserAssetsInMap({ mapRef })
  const { userAssets } = useContext(UserAssetsContext)
  const hazardType = 'chronic_heat'
  const navigate = useNavigate()

  const handleSelectAssetsClick = () => {
    navigate('/assets')
  }

  const updateAssetsOnMap = useCallback(
    (portfolioName: string) => {
      if (!portfolioName) {
        removeUserAssetsFromMap()
        return
      }

      if (userAssets && portfolioName == ASSET_SELSECT_UNSAVED_ASSETS_VALUE) {
        updateUserAssetsInMap(userAssets)
      }
    },
    [removeUserAssetsFromMap, updateUserAssetsInMap, userAssets],
  )

  useEffect(
    function updateHazardMapTiles() {
      if (
        !mapRef.current ||
        !setIsLoading ||
        !hazardIndicator ||
        !climateModel ||
        !scenario ||
        !year ||
        !isMapLoaded
      ) {
        return
      }

      setIsLoading(true)

      void mapRef.current.once('idle', () => setIsLoading(false))

      const hazardSource = mapRef.current.getSource(
        MapSourceIds.HAZARD_DATA,
      ) as RasterTileSource

      const tileUrlToUse = `https://i0h9crgku9.execute-api.us-west-2.amazonaws.com/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?url=s3://ukri-eodh-hazard-tiles-test/hazard-test-titiler-xarray/hazard.zarr/${hazardType}/osc/v2/${hazardIndicator}_${climateModel}_${scenario}_${year}-xarray&variable=data&rescale=0%2C200&colormap_name=ylorrd&maxzoom10=`

      if (!hazardSource) {
        mapRef.current.addSource(MapSourceIds.HAZARD_DATA, {
          type: 'raster',
          tiles: [tileUrlToUse],
        })
      }

      if (hazardSource) {
        hazardSource.setTiles([tileUrlToUse])
      }

      const hazardLayer = mapRef.current.getLayer(MapSourceIds.HAZARD_DATA)
      if (!hazardLayer) {
        mapRef.current.addLayer(
          {
            id: MapSourceIds.HAZARD_DATA,
            type: 'raster',
            source: MapSourceIds.HAZARD_DATA,
            paint: {
              'raster-opacity': 0.5,
            },
          },
          firstLabelsLayerId,
        )
      }
    },
    [
      climateModel,
      firstLabelsLayerId,
      hazardIndicator,
      isMapLoaded,
      mapRef,
      scenario,
      setIsLoading,
      year,
    ],
  )

  const sidebarContent = (
    <div
      className={`${containerStyles.flexColumnSpaceBetweenStart} ${hazardsStyles.sidebarContent}`}
    >
      <div
        className={`${containerStyles.flexColumnStartStart} ${hazardsStyles.sidepanelMidSection}`}
      >
        <form
          className={`${containerStyles.flexColumnStartStart} ${hazardsStyles.hazardTilesForm}`}
        >
          <InputLabelContainer>
            <label htmlFor="hazard-type">Hazard Type</label>
            <Select.Root value={hazardType}>
              <Select.Trigger placeholder="Select" />
              <Select.Content id="hazard-type">
                <Select.Item value={hazardType}>Chronic Heat</Select.Item>
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>

          <InputLabelContainer>
            <label htmlFor="hazard-indicator">Hazard Indicator</label>
            <Select.Root
              value={hazardIndicator}
              onValueChange={setHazardIndicator}
            >
              <Select.Trigger placeholder="Select" />
              <Select.Content id="hazard-indicator">
                {indicatorOptions.map(({ value, label }) => (
                  <Select.Item key={value} value={value}>
                    {label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>

          <InputLabelContainer>
            <label htmlFor="climateModel">Climate Model</label>
            <Select.Root value={climateModel} onValueChange={setClimateModel}>
              <Select.Trigger placeholder="Select" />
              <Select.Content id="climateModel">
                {climateModelOptions.map(({ value, label }) => (
                  <Select.Item key={value} value={value}>
                    {label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>

          <div
            className={`${containerStyles.flexRowSpaceBetweenCenter} ${hazardsStyles.scenarioYearRow}`}
          >
            <InputLabelContainer>
              <label htmlFor="scenario">Scenario</label>
              <Select.Root value={scenario} onValueChange={setScenario}>
                <Select.Trigger placeholder="Select" />
                <Select.Content id="scenario">
                  {scenarioOptions.map(({ value, label }) => (
                    <Select.Item key={value} value={value}>
                      {label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </InputLabelContainer>
            <InputLabelContainer>
              <label htmlFor="year">Year</label>
              <Select.Root value={year} onValueChange={setYear}>
                <Select.Trigger placeholder="Select" />
                <Select.Content id="year">
                  {yearOptions.map((year) => (
                    <Select.Item key={year} value={year}>
                      {year}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </InputLabelContainer>
          </div>
        </form>
        <Separator size="4" />
        <InputLabelContainer>
          <label htmlFor="year">View Assets on Map</label>
          <AssetsSelect showUnsaved onValueChange={updateAssetsOnMap} />
        </InputLabelContainer>
        <div className={hazardsStyles.indicatorDetails}>
          <Heading size="4" as="h2">
            Indicator Detail (placeholder for demo)
          </Heading>
          <Text>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              velit nisi, condimentum nec arcu.
            </p>

            <p>
              Aliquam consequat, odio sed euismod bibendum, ipsum ligula sodales
              augue, vitae hendrerit turpis justo at elit.
            </p>
          </Text>
        </div>
      </div>

      <Button
        className={hazardsStyles.selectAssetsButton}
        onClick={handleSelectAssetsClick}
      >
        Select Assets for Analysis
      </Button>
    </div>
  )

  const legend = <>Legend Placeholder</>

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Hazards"
      subtitle="Explore hazard scenarios or analyze assets."
      sidebarWidth="421px"
      legend={legend}
    />
  )
}

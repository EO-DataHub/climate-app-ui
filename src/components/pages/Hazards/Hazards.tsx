import { Button, Heading, Select, Text } from '@radix-ui/themes'
import { Map } from '../../Map/Map'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { useMap } from '../../Map/useMap'
import containerStyles from '../../genericStyles/containers.module.css'
import hazardsStyles from './Hazards.module.css'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { RasterTileSource } from 'maplibre-gl'
import { LoadingContext } from '../../../context/LoadingContext'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import {
  cmip6ModelOptions,
  indicatorOptions,
  scenarioOptions,
  yearOptions,
} from '../../../services/api/fakeApiData'

enum MapSourceIds {
  HAZARD_DATA = 'hazard-data',
}

export const Hazards = () => {
  const { mapContainer, mapRef, isMapLoaded } = useMap()
  const { setIsLoading } = useContext(LoadingContext)
  const navigate = useNavigate()
  const [hazardIndicator, setHazardIndicator] = useState(
    indicatorOptions[0].value,
  )
  const [cmip6Model, setCmip6Model] = useState(cmip6ModelOptions[0].value)
  const [scenario, setScenario] = useState(scenarioOptions[0].value)
  const [year, setYear] = useState(yearOptions[0])
  const hazardType = 'chronic_heat'

  const handleSelectAssetsClick = () => {
    navigate('/assets')
  }

  useEffect(
    function updateHazardMapTiles() {
      if (
        !mapRef.current ||
        !setIsLoading ||
        !hazardIndicator ||
        !cmip6Model ||
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

      const tileUrlToUse = `https://i0h9crgku9.execute-api.us-west-2.amazonaws.com/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?url=s3://ukri-eodh-hazard-tiles-test/hazard-test-titiler-xarray/hazard.zarr/${hazardType}/osc/v2/${hazardIndicator}_${cmip6Model}_${scenario}_${year}-xarray&variable=data&rescale=0%2C200&colormap_name=viridis&maxzoom10=`

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
        mapRef.current.addLayer({
          id: MapSourceIds.HAZARD_DATA,
          type: 'raster',
          source: MapSourceIds.HAZARD_DATA,
        })
      }
    },
    [
      cmip6Model,
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
            <label htmlFor="cmip6Model">CMIP6 Model</label>
            <Select.Root value={cmip6Model} onValueChange={setCmip6Model}>
              <Select.Trigger placeholder="Select" />
              <Select.Content id="cmip6Model">
                {cmip6ModelOptions.map(({ value, label }) => (
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

import {
  Button,
  Heading,
  Select,
  Separator,
  Spinner,
  Text,
} from '@radix-ui/themes'
import { RasterTileSource } from 'maplibre-gl'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import { MapSourceIds } from '../../../configuration/constants'
import { LoadingContext } from '../../../context/LoadingContext'
import {
  climateModelOptions,
  indicatorOptions,
  legendParameters,
  scenarioOptions,
  yearOptions,
} from '../../../library/api/fakeApiData'
import { useHazardMetadata } from '../../../library/hazards/useHazardMetadata'
import { useAssetPortfolios } from '../../../library/userAssets/useAssetPortfolios'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { IntervalLegend } from '../../IntervalLegend/IntervalLegend'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { LoadingIndicator } from '../../LoadingIndicator/LoadingIndicator'
import { Map } from '../../Map/Map'
import { useMap } from '../../Map/useMap'
import { useMapClickToUpdateDraggableMarker } from '../../Map/useMapClickToUpdateDraggableMarker'
import hazardsStyles from './Hazards.module.scss'
import IndicatorDetailsFormatter from './IndicatorDetailsFormatter'

const EDOH_BASE_URL = import.meta.env.VITE_EODH_BASE_URL

export const Hazards = () => {
  const [hazardIndicator, setHazardIndicator] = useState(
    indicatorOptions[0].value,
  )
  const [hazardMarkerValue, setHazardMarkerValue] = useState<
    number | string | null
  >(null)
  const [climateModel, setClimateModel] = useState(climateModelOptions[0].value)
  const [scenario, setScenario] = useState(scenarioOptions[0].value)
  const [year, setYear] = useState(yearOptions[0])
  const { mapContainer, mapRef, isMapLoaded } = useMap()
  const { setIsMapLoading } = useContext(LoadingContext)
  const { updateCurrentPortfolioShown } = useAssetPortfolios({
    mapRef,
    isMapLoaded,
  })
  const hazardType = 'chronic_heat'
  const navigate = useNavigate()
  const { hazardMetadata, isHazardMetadataError, isHazardMetadataLoading } =
    useHazardMetadata({
      climateModel,
      hazardIndicator,
      hazardType,
      scenario,
      year,
    })
  const { markerCoordinates, isMarkerOnMap } =
    useMapClickToUpdateDraggableMarker({
      isMapLoaded,
      mapRef,
    })
  const hazardUnits = hazardMetadata?.properties['osc-hazard:units']
  const hazardIndicatorLabel = indicatorOptions.find(
    (option) => option.value === hazardIndicator,
  )?.label
  const zarrPath = `s3://ukri-eodh-hazard-tiles-test/hazard/${hazardType}/osc/v2/${hazardIndicator}_${climateModel}_${scenario}_${year}-xarray`

  const hazardDetail = isHazardMetadataError ? (
    <>Hazard indicator details are currently unavailable.</>
  ) : (
    <IndicatorDetailsFormatter
      indicatorDetails={hazardMetadata?.properties['osc-hazard:description']}
    />
  )
  const hazardOpacity = useMemo(
    () =>
      Number(
        window
          .getComputedStyle(document.body)
          .getPropertyValue('--hazard-raster-opacity'),
      ),
    [],
  )
  const handleSelectAssetsClick = () => {
    navigate('/assets')
  }

  // this is not scalable, but a temporary solution for the demo
  const legendParametersToUse = hazardIndicator.includes('days_tas_above')
    ? legendParameters.daysWithAverageTemperatureAbove
    : legendParameters.meanDegreeDaysAbove

  useEffect(
    function getHazardValueAtLocation() {
      const queryHazardValueByCoordinates = () => {
        if (!markerCoordinates?.lat || !markerCoordinates?.lng) return

        const axiosController = new AbortController()

        // Bodge to use version of the zarrs which are quicker to load for getting value at a point
        const sgZarrPath = zarrPath.replace(
          'ukri-eodh-hazard-tiles-test',
          'ukri-eodh-hazard-tiles-sg',
        )
        const url = `${EDOH_BASE_URL}/get_hazard_value?zarr_path=${sgZarrPath}/&latitude=${markerCoordinates.lat}&longitude=${markerCoordinates.lng}`

        setHazardMarkerValue(null)

        axios
          .get(url, { signal: axiosController.signal })
          .then((res) => {
            setHazardMarkerValue(res.data.hazard_value)
          })
          .catch((error) => {
            if (error.code !== 'ERR_CANCELED') {
              setHazardMarkerValue('unknown')
            }
          })

        return axiosController
      }

      const queryController = queryHazardValueByCoordinates()

      return () => {
        queryController?.abort()
      }
    },
    [markerCoordinates, zarrPath],
  )

  useEffect(
    function updateHazardMapTiles() {
      if (
        !climateModel ||
        !hazardIndicator ||
        !isMapLoaded ||
        !legendParametersToUse ||
        !mapRef.current ||
        !scenario ||
        !setIsMapLoading ||
        !year
      ) {
        return
      }

      setIsMapLoading(true)

      void mapRef.current.once('idle', () => setIsMapLoading(false))

      const hazardSource = mapRef.current.getSource(
        MapSourceIds.HAZARD_DATA,
      ) as RasterTileSource

      const titilerColormap = JSON.stringify(
        legendParametersToUse.intervals.map((interval, index) => {
          return [
            interval,
            legendParametersToUse.intervalRgbaColor[index].split(','),
          ]
        }),
      )

      const tileUrlToUse = `https://i0h9crgku9.execute-api.us-west-2.amazonaws.com/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?url=${zarrPath}&variable=data&colormap=${titilerColormap}&maxzoom10=`

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
          paint: {
            'raster-opacity': hazardOpacity,
          },
        })
      }
    },
    [
      climateModel,
      hazardIndicator,
      hazardOpacity,
      isMapLoaded,
      legendParametersToUse,
      mapRef,
      scenario,
      setIsMapLoading,
      year,
      zarrPath,
    ],
  )

  const hazardLocationInfo = (
    <div className={hazardsStyles.locationInfoWrapper}>
      <h3>Location</h3>
      <p>
        {markerCoordinates?.lat.toFixed(4)}°,{' '}
        {markerCoordinates?.lng.toFixed(4)}°
      </p>
      <p>
        Indicator value is{' '}
        {hazardMarkerValue === null ? (
          <Spinner style={{ display: 'inline-block' }} />
        ) : (
          Number(hazardMarkerValue).toFixed(0)
        )}{' '}
        {hazardUnits ?? 'unknown units'}
      </p>
    </div>
  )

  const sidebarContent = (
    <div className={hazardsStyles.sidebarContent}>
      <div className={hazardsStyles.sidepanelMidSection}>
        <form className={hazardsStyles.hazardTilesForm}>
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

          <div className={hazardsStyles.scenarioYearRow}>
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
            {hazardIndicatorLabel}
          </Heading>
          {isMarkerOnMap ? hazardLocationInfo : undefined}
          {isHazardMetadataLoading ? <LoadingIndicator /> : hazardDetail}
        </div>

        <Separator size="4" />

        <div className={hazardsStyles.portfolioSelectWrapper}>
          <Text size="3" weight="bold">
            View Assets on Map
          </Text>
          <InputLabelContainer>
            <AssetsSelect
              showUnsaved
              onValueChange={updateCurrentPortfolioShown}
            />
          </InputLabelContainer>
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

  const legend = (
    <IntervalLegend
      title={hazardIndicatorLabel}
      legendParameters={legendParametersToUse}
    />
  )

  return (
    <PageWithMapLayout
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Hazards"
      subtitle="Explore hazard scenarios or analyze assets."
      sidebarWidth="542px"
      legend={legend}
    />
  )
}

import Form, { IChangeEvent } from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { GenericObjectType } from '@rjsf/utils'
import { Button, Flex, Heading, Spinner, Tabs } from '@radix-ui/themes'
import { RasterTileSource } from 'maplibre-gl'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { legendParameters } from '../../../library/api/fakeApiData'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { IntervalLegend } from '../../IntervalLegend/IntervalLegend'
import { LoadingContext } from '../../../context/LoadingContext'
import { LoadingIndicator } from '../../LoadingIndicator/LoadingIndicator'
import { Map } from '../../Map/Map'
import {
  HAZARDS_LAYER_INITIAL_OPACITY,
  MapSourceIds,
} from '../../../configuration/constants'
import { useAssetPortfolios } from '../../../library/userAssets/useAssetPortfolios'
import { useHazardMetadata } from '../../../library/hazards/useHazardMetadata'
import { useMap } from '../../Map/useMap'
import IndicatorDetailsFormatter from './IndicatorDetailsFormatter'
import hazardStyles from './Hazards.module.scss'
import { useGetHazardValueByMapClick } from './useGetHazardValueByMapClick'
import { LocationValueOverview } from '../../LocationValueOverview/LocationValueOverview'
import { HazardsPageContext } from '../../../context/HazardsPageContext'
import {
  chronicHeatSchema,
  chronicHeatUiSchema,
} from '../../../library/api/rjsfChronicHeat.ts'
import sidebarStyles from '../../Layout/Sidebar.module.scss'
import { RJSFRadixSelectWidget } from './RJSFRadixSelectWidget.tsx'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout.tsx'
import { RasterLayerOpacityControl } from '../../Map/RasterLayerOpacityControl.tsx'

const customWidgets = {
  customSelect: RJSFRadixSelectWidget,
}

interface HazardFormData {
  scenario: string
  year: string
  climate_model: string
  indicator: string
}

// There must be a type defined for this in RJSF, but I can't find it. I hate TypeScript more than I hate JavaScript.
interface RSJFSelectItem {
  title: string
  const: string
}

const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL

export const Hazards = () => {
  const [hazardIndicatorLabel, setHazardIndicatorLabel] = useState('')
  const [scenarioLabel, setScenarioLabel] = useState('')
  const {
    climateModel,
    hazardIndicator,
    persistedMapCenter,
    persistedMapZoom,
    scenario,
    setClimateModel,
    setHazardIndicator,
    setPersistedMapCenter,
    setPersistedMapZoom,
    setScenario,
    setYear,
    year,
    hazardMarkerValue,
    markerCoordinates,
  } = useContext(HazardsPageContext)

  const [formData, setFormData] = useState<HazardFormData>({
    year: year,
    climate_model: climateModel,
    scenario: scenario,
    indicator: hazardIndicator,
  })

  const { mapContainer, mapRef, isMapLoaded } = useMap({
    center: persistedMapCenter,
    zoom: persistedMapZoom,
    setPersistedMapCenter,
    setPersistedMapZoom,
  })
  const { setIsMapLoading } = useContext(LoadingContext)
  const { updateCurrentPortfolioShown, isPortfolioLoading } =
    useAssetPortfolios({
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

  const zarrPath = `https://ukri-eodh-hazard-tiles-sg.s3.eu-west-1.amazonaws.com/hazard/${hazardType}/osc/v2/${hazardIndicator}_${climateModel}_${scenario}_${year}-xarray`

  useGetHazardValueByMapClick({
    isMapLoaded,
    mapRef,
    zarrPath,
  })

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
    ? climateModel.includes('uk_')
      ? legendParameters.ukDaysWithAverageTemperatureAbove
      : legendParameters.daysWithAverageTemperatureAbove
    : climateModel.includes('uk_')
      ? legendParameters.ukMeanDegreeDaysAbove
      : legendParameters.meanDegreeDaysAbove

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
        MapSourceIds.HAZARDS,
      ) as RasterTileSource

      const titilerColormap = JSON.stringify(
        legendParametersToUse.intervals.map((interval, index) => {
          return [
            interval,
            legendParametersToUse.intervalRgbaColor[index].split(','),
          ]
        }),
      )

      const tileUrlToUse = `${HUB_BASE_URL}/titiler/xarray/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?url=${zarrPath}&variable=data&colormap=${titilerColormap}&maxzoom10=`

      if (!hazardSource) {
        mapRef.current.addSource(MapSourceIds.HAZARDS, {
          type: 'raster',
          tiles: [tileUrlToUse],
        })
      } else {
        hazardSource.setTiles([tileUrlToUse])
      }

      const hazardLayer = mapRef.current.getLayer(MapSourceIds.HAZARDS)
      const userAssetsLayer = mapRef.current.getLayer(MapSourceIds.USER_ASSETS)

      const layerIdToLoadObservationsBelow = userAssetsLayer
        ? userAssetsLayer.id
        : undefined

      if (!hazardLayer) {
        mapRef.current.addLayer(
          {
            id: MapSourceIds.HAZARDS,
            type: 'raster',
            source: MapSourceIds.HAZARDS,
            paint: {
              'raster-opacity': hazardOpacity,
            },
          },
          layerIdToLoadObservationsBelow,
        )
      }

      // Add the countries boundaries GeoJSON source if it doesn't exist
      const ukSource = mapRef.current.getSource('uk')
      if (!ukSource) {
        mapRef.current.addSource('uk', {
          type: 'geojson',
          data: './geojson/uk.geojson',
        })
      }

      // Add the countries boundaries layer if it doesn't exist
      const ukLayer = mapRef.current.getLayer('uk-boundaries')
      if (!ukLayer) {
        mapRef.current.addLayer({
          id: 'uk-boundaries',
          type: 'line',
          source: 'uk',
          paint: {
            'line-color': '#000',
            'line-width': 1,
            'line-opacity': 0.3,
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

  useEffect(() => {
    if (setHazardIndicator) setHazardIndicator(formData.indicator)
    if (setClimateModel) setClimateModel(formData.climate_model)
    if (setScenario) setScenario(formData.scenario)
    if (setYear) setYear(formData.year)
  }, [formData, setHazardIndicator, setClimateModel, setScenario, setYear])

  const sidebarContent = (
    <div className={hazardStyles.content}>
      <div className={hazardStyles.contentMidSection}>
        <Form
          schema={chronicHeatSchema}
          className={sidebarStyles.contentForm}
          uiSchema={chronicHeatUiSchema}
          widgets={customWidgets}
          validator={validator}
          formData={formData}
          onChange={(e: IChangeEvent, idx) => {
            if (idx === 'root_indicator') {
              // Remove the magic and treat the data as a Plain Old Javascript Object
              // so we don't get the linter moaning about "oneOf".
              const pojo: GenericObjectType = Object.assign(
                {},
                e.schema.properties,
              )
              const res: RSJFSelectItem = pojo.indicator.oneOf.find(
                (item: RSJFSelectItem) => item.const === e.formData?.indicator,
              )
              setHazardIndicatorLabel(res ? res.title : ' ')
            } else if (idx === 'root_scenario') {
              // Scenarios don't have pretty labels in inventory.json, so we just have to use the value.
              setScenarioLabel(e.formData.scenario)
            }

            setFormData(e.formData)
          }}
        />

        <Tabs.Root defaultValue="overview" className={hazardStyles.tabsRoot}>
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="Methodology">Methodology</Tabs.Trigger>
          </Tabs.List>
          <div className={hazardStyles.tabsContentWrapper}>
            <Tabs.Content value="overview">
              <LocationValueOverview
                isMarkerOnMap={!!markerCoordinates}
                layerLabel={hazardIndicatorLabel}
                locationValue={hazardMarkerValue}
                markerCoordinates={markerCoordinates}
                scenario={scenarioLabel}
                year={year}
              />
            </Tabs.Content>

            <Tabs.Content value="Methodology">
              <Heading size="4" as="h2">
                {hazardIndicatorLabel}
              </Heading>

              {isHazardMetadataLoading ? <LoadingIndicator /> : hazardDetail}
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>

      <div className={sidebarStyles.contentBottomButtonRow}>
        <div className={sidebarStyles.selectAssetsWrapper}>
          <Flex gap="1">
            <label>View Assets on Map</label>{' '}
            {isPortfolioLoading ? <Spinner /> : null}
          </Flex>

          <InputLabelContainer>
            <AssetsSelect onValueChange={updateCurrentPortfolioShown} />
          </InputLabelContainer>
        </div>
        <div className={sidebarStyles.selectAssetsButtonWrapper}>
          <Button onClick={handleSelectAssetsClick}>
            Select Assets for Analysis
          </Button>
        </div>
      </div>
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
      map={
        <Map
          mapContainer={mapContainer}
          legend={legend}
          additionalControls={
            <RasterLayerOpacityControl
              initialOpacity={HAZARDS_LAYER_INITIAL_OPACITY}
              isMapLoaded={isMapLoaded}
              layerId={MapSourceIds.HAZARDS}
              mapRef={mapRef}
              sliderLabel="Adjust Hazards Layer Opacity"
            />
          }
        />
      }
      sidebarContent={sidebarContent}
      title="Hazards"
      subtitle="Explore hazard scenarios or analyze assets."
      sidebarWidth="40%"
    />
  )
}

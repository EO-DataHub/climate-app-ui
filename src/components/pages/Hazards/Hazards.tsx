import { Button, Heading, Tabs } from '@radix-ui/themes'
import { RasterTileSource } from 'maplibre-gl'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  climateModelOptions,
  getOptionsByClimateModel,
  indicatorOptions,
  legendParameters,
} from '../../../library/api/fakeApiData'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { IntervalLegend } from '../../IntervalLegend/IntervalLegend'
import { LoadingContext } from '../../../context/LoadingContext'
import { LoadingIndicator } from '../../LoadingIndicator/LoadingIndicator'
import { Map } from '../../Map/Map'
import { MapSourceIds } from '../../../configuration/constants'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { useAssetPortfolios } from '../../../library/userAssets/useAssetPortfolios'
import { useHazardMetadata } from '../../../library/hazards/useHazardMetadata'
import { useMap } from '../../Map/useMap'
import hazardsStyles from './Hazards.module.scss'
import IndicatorDetailsFormatter from './IndicatorDetailsFormatter'
import sidebarStyles from '../../Layout/Sidebar.module.scss'
import { useGetHazardValueByMapClick } from './useGetHazardValueByMapClick'
import { LocationValueOverview } from '../../LocationValueOverview/LocationValueOverview'
import { ObjectFieldTemplateProps, UiSchema } from '@rjsf/utils'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { chronicHeatSchema } from '../../../library/api/rjsfChronicHeat.ts'
import inputLabelContainerStyles from '../../Form/InputLabelContainer.module.scss'

function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  return (
    <div>
      {props.title}
      {props.description}
      {props.properties.map((element) => (
        <div
          className={inputLabelContainerStyles.container}
          key={element.content.key}
        >
          {element.content}
        </div>
      ))}
    </div>
  )
}

interface HazardFormData {
  indicator_model: string
  scenario: string
  year: string
  climate_model: string
}

export const Hazards = () => {
  const [hazardIndicator, setHazardIndicator] = useState(
    indicatorOptions[0].value,
  )

  const [climateModel, setClimateModel] = useState(climateModelOptions[0].value)
  const [scenario, setScenario] = useState('')

  const [year, setYear] = useState('')
  const { mapContainer, mapRef, isMapLoaded } = useMap()
  const [formData, setFormData] = useState<HazardFormData>({
    indicator_model: indicatorOptions[0].value,
    year: year,
    climate_model: climateModelOptions[0].value,
    scenario: scenario,
  })
  const { setIsMapLoading } = useContext(LoadingContext)
  const { updateCurrentPortfolioShown } = useAssetPortfolios({
    mapRef,
    isMapLoaded,
  })

  useEffect(() => {
    const { scenarioOptions, yearOptions } =
      getOptionsByClimateModel(climateModel)
    setScenario(scenarioOptions[0].value)
    setYear(yearOptions[0])
  }, [climateModel])

  const { scenarioOptions } = getOptionsByClimateModel(climateModel)
  const scenarioLabel = scenarioOptions.find(
    (option) => option.value === scenario,
  )?.label

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

  const hazardIndicatorLabel = indicatorOptions.find(
    (option) => option.value === hazardIndicator,
  )?.label
  const zarrPath = `s3://ukri-eodh-hazard-tiles-us-west-2/hazard/${hazardType}/osc/v2/${hazardIndicator}_${climateModel}_${scenario}_${year}-xarray`

  const { isMarkerOnMap, hazardMarkerValue, markerCoordinates } =
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
      void mapRef.current.once('error', () => {
        setIsMapLoading(false)
        if (mapRef.current?.getLayer(MapSourceIds.HAZARD_DATA)) {
          mapRef.current?.removeLayer(MapSourceIds.HAZARD_DATA)
        }
      })

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
      } else {
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

  const uiSchema: UiSchema = {
    'ui:submitButtonOptions': {
      norender: true,
    },
  }

  useEffect(() => {
    setHazardIndicator(formData?.indicator_model)
    setClimateModel(formData?.climate_model)
    setScenario(formData?.scenario)
    setYear(formData?.year)
  }, [formData])

  const sidebarContent = (
    <div className={sidebarStyles.content}>
      <div className={sidebarStyles.contentMidSection}>
        <Form
          schema={chronicHeatSchema}
          uiSchema={uiSchema}
          formData={formData}
          templates={{ ObjectFieldTemplate }}
          className={hazardsStyles.hazardTilesForm}
          onChange={(e) => setFormData(e.formData)}
          validator={validator}
        />

        <Tabs.Root defaultValue="overview" className={sidebarStyles.tabsRoot}>
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="Methodology">Methodology</Tabs.Trigger>
          </Tabs.List>
          <div className={sidebarStyles.tabsContentWrapper}>
            <Tabs.Content value="overview">
              <LocationValueOverview
                isMarkerOnMap={isMarkerOnMap}
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

        <div className={sidebarStyles.contentBottomButtonRow}>
          <div className={sidebarStyles.selectAssetsWrapper}>
            <label>View Assets on Map</label>
            <InputLabelContainer>
              <AssetsSelect
                showUnsaved
                onValueChange={updateCurrentPortfolioShown}
              />
            </InputLabelContainer>
          </div>
          <div className={sidebarStyles.selectAssetsButtonWrapper}>
            <Button onClick={handleSelectAssetsClick}>
              Select Assets for Analysis
            </Button>
          </div>
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
      map={<Map mapContainer={mapContainer} />}
      sidebarContent={sidebarContent}
      title="Hazards"
      subtitle="Explore hazard scenarios or analyze assets."
      sidebarWidth="40%"
      legend={legend}
    />
  )
}

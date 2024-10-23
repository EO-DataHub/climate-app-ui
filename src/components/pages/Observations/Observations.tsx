import { Button, Select, Tabs, Text } from '@radix-ui/themes'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  MapSourceIds,
  OBSERVATIONS_LAYER_INITIAL_OPACITY,
} from '../../../configuration/constants'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { InfoPopover } from '../../InfoPopover/InfoPopover'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { LoadingContext } from '../../../context/LoadingContext'
import { LocationValueOverview } from '../../LocationValueOverview/LocationValueOverview'
import { Map } from '../../Map/Map'
import { ObservationsPageContext } from '../../../context/ObservationsPageContext'
import {
  observationSensorPopupContent,
  observationTypePopupContent,
} from '../../../configuration/infoPopupContentObservations'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { RasterLayerOpacityControl } from '../../Map/RasterLayerOpacityControl'
import { useAssetPortfolios } from '../../../library/userAssets/useAssetPortfolios'
import { useGetObservationValueByMapclick } from './useGetObservationValueByMapClick'
import { useMap } from '../../Map/useMap'
import { useUpdateObservationsMapTiles } from './useUpdateObservationsMapTiles'
import formStyles from '../../../library/genericStyles/forms.module.scss'
import sidebarStyles from '../../Layout/Sidebar.module.scss'

const MIN_TEMP = 10
const MAX_TEMP = 45

export const Observations = () => {
  const navigate = useNavigate()
  const { setIsMapLoading } = useContext(LoadingContext)
  const {
    observationTypeConfigs,
    persistedMapCenter,
    persistedMapZoom,
    selectedObservationLayerUrl,
    selectedObservationType,
    setPersistedMapCenter,
    setPersistedMapZoom,
    setSelectedObservationLayerUrl,
    setSelectedObservationType,
    markerCoordinates,
    observationMarkerValue,
    sensorFilterOptions,
    isSensorFilterUsed,
    selectedSensor,
    setSelectedSensor,
    filteredDatasetOptions,
  } = useContext(ObservationsPageContext)

  const { mapContainer, mapRef, isMapLoaded } = useMap({
    center: persistedMapCenter ?? [0, 51.5],
    zoom: persistedMapZoom ?? 7,
    setPersistedMapCenter,
    setPersistedMapZoom,
  })
  const { updateCurrentPortfolioShown } = useAssetPortfolios({
    mapRef,
    isMapLoaded,
  })
  useGetObservationValueByMapclick({
    isMapLoaded,
    mapRef,
  })

  useUpdateObservationsMapTiles({
    isMapLoaded,
    mapRef,
    maxTemp: MAX_TEMP,
    minTemp: MIN_TEMP,
    selectedObservationLayerUrl,
    setIsMapLoading,
  })

  const handleSelectObservationType = (value: string) => {
    setSelectedObservationType?.(value)
  }

  const handleSelectAssetsClick = () => {
    navigate('/assets')
  }

  const sidebarContent = (
    <div className={sidebarStyles.content}>
      <div className={sidebarStyles.contentMidSection}>
        <form className={sidebarStyles.contentForm}>
          <div className={formStyles.multipleInputsRow}>
            <InputLabelContainer>
              <div className={formStyles.labelWithInfoPopoverRow}>
                <label htmlFor="observation-type">Observation Type</label>
                <InfoPopover>{observationTypePopupContent}</InfoPopover>
              </div>

              <Select.Root
                onValueChange={handleSelectObservationType}
                value={selectedObservationType}
              >
                <Select.Trigger placeholder="Select" />
                <Select.Content id="observation-type">
                  {observationTypeConfigs?.map(({ value, label }) => (
                    <Select.Item value={value} key={value}>
                      {label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </InputLabelContainer>

            {isSensorFilterUsed ? (
              <InputLabelContainer>
                <div className={formStyles.labelWithInfoPopoverRow}>
                  <label htmlFor="sensor">Sensor</label>
                  <InfoPopover>{observationSensorPopupContent}</InfoPopover>
                </div>

                <Select.Root
                  onValueChange={setSelectedSensor}
                  value={selectedSensor}
                >
                  <Select.Trigger placeholder="Select" />
                  <Select.Content id="sensor">
                    {sensorFilterOptions.map((option) => (
                      <Select.Item value={option} key={option}>
                        {option}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </InputLabelContainer>
            ) : null}
          </div>

          <InputLabelContainer>
            <div className={formStyles.labelWithInfoPopoverRow}>
              <label htmlFor="observation-date">Datasets Available</label>
            </div>
            <Select.Root
              value={selectedObservationLayerUrl}
              onValueChange={setSelectedObservationLayerUrl}
            >
              <Select.Trigger placeholder="Select" />
              <Select.Content id="observation-date">
                {filteredDatasetOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </InputLabelContainer>
        </form>
        <Tabs.Root defaultValue="overview" className={sidebarStyles.tabsRoot}>
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="Methodology">Methodology</Tabs.Trigger>
          </Tabs.List>
          <div className={sidebarStyles.tabsContentWrapper}>
            <Tabs.Content value="overview">
              <LocationValueOverview
                isMarkerOnMap={!!markerCoordinates}
                layerLabel={''}
                locationValue={
                  observationMarkerValue === null
                    ? null
                    : observationMarkerValue === 'Unknown'
                      ? 'Unknown'
                      : `${observationMarkerValue} °C`
                }
                markerCoordinates={markerCoordinates}
              />
            </Tabs.Content>

            <Tabs.Content value="Methodology">
              <Text size="3">
                <p>
                  Land Surface Temperature means radiative temperature of the
                  outermost “skin” layer of a given surface. It is related to
                  blackbody radiation at a given temperature, modified by
                  spectral emissivity component.
                </p>
                <p>
                  <strong>Credit</strong>: University of Leicester, Surface
                  Temperature Group, NCEO
                </p>
                <p>
                  <strong>Citation</strong>: Perry, M. J. S, Remedios, J. J,
                  Ghent, D, Veal, K. L, Göttsche, F, A new inverse method for
                  the retrieval of Land Surface Temperature and Emissivity from
                  the ASTER instrument, AGU Earth and Space Science, (in review
                  2024)
                </p>
              </Text>
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>

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
  )

  const legend = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: `12px`,
      }}
    >
      <div style={{ width: '100%', textAlign: 'left', marginBottom: '5px' }}>
        Degrees Celsius
      </div>
      <img
        src="https://titiler.xyz/colorMaps/jet?format=png"
        alt="Color Map Legend"
        style={{ width: '100%', height: 'auto' }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span>{MIN_TEMP}</span>
        <span>{MAX_TEMP}</span>
      </div>
    </div>
  )

  return (
    <PageWithMapLayout
      map={
        <Map
          mapContainer={mapContainer}
          additionalControls={
            <RasterLayerOpacityControl
              initialOpacity={OBSERVATIONS_LAYER_INITIAL_OPACITY}
              isMapLoaded={isMapLoaded}
              layerId={MapSourceIds.OBSERVATIONS}
              mapRef={mapRef}
              sliderLabel="Adjust Observations Layer Opacity"
            />
          }
          legend={legend}
        />
      }
      sidebarContent={sidebarContent}
      title="Observations"
      subtitle="Earth Observation Data can be used to provide additional insight into local variation in asset risk."
      sidebarWidth="40%"
    />
  )
}

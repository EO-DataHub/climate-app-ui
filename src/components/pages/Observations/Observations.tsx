import {
  Box,
  Button,
  Flex,
  Spinner,
  Tabs,
  Text,
  TextField,
} from '@radix-ui/themes'
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  MapSourceIds,
  OBSERVATIONS_LAYER_INITIAL_OPACITY,
} from '../../../configuration/constants'
import { AssetsSelect } from '../../AssetsSelect/AssetsSelect'
import { InputLabelContainer } from '../../Form/InputLabelContainer'
import { LoadingContext } from '../../../context/LoadingContext'
import { LocationValueOverview } from '../../LocationValueOverview/LocationValueOverview'
import { Map } from '../../Map/Map'
import { ObservationsPageContext } from '../../../context/ObservationsPageContext'
import { PageWithMapLayout } from '../../Layout/PageWithMapLayout'
import { RasterLayerOpacityControl } from '../../Map/RasterLayerOpacityControl'
import { useAssetPortfolios } from '../../../library/userAssets/useAssetPortfolios'
import { useGetObservationValueByMapclick } from './useGetObservationValueByMapClick'
import { useMap } from '../../Map/useMap'
import { useUpdateObservationsMapTiles } from './useUpdateObservationsMapTiles'
import formStyles from '../../../library/genericStyles/forms.module.scss'
import sidebarStyles from '../../Layout/Sidebar.module.scss'
import observationStyles from './Observations.module.scss'
import { Autocomplete, TextField as MuiTextField } from '@mui/material'
import { QuerySTACCatalog } from '../../../library/api/getKerchunkUrl'
import {
  VALID_OBSERVATION_MONTHS,
  VALID_OBSERVATION_YEARS,
  AVAILABLE_OBSERVATION_SENSORS,
  AVAILABLE_OBSERVATION_TIME_OF_DAY,
  AVAILABLE_OBSERVATION_TYPES,
  DEFAULT_SELECTED_OBSERVATION,
  ObservationDatasetOption,
} from '../../../library/api/fakeApiData'
import { toast } from 'react-toastify'
export interface AutoCompleteOption {
  label: string
  value: number | string
}

interface ObservationFilterProps {
  value: AutoCompleteOption[]
  options: AutoCompleteOption[]
  filterType: string
  label: string
  showAllButton?: boolean
}

const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL

const DEFAULT_MIN_TEMP = '-10'
const DEFAULT_MAX_TEMP = '45'

export const Observations = () => {
  const navigate = useNavigate()
  const { setIsMapLoading } = useContext(LoadingContext)
  const [minTemp, setMinTemp] = useState(DEFAULT_MIN_TEMP)
  const [maxTemp, setMaxTemp] = useState(DEFAULT_MAX_TEMP)
  const [loadingDatasets, setLoadingDatasets] = useState(false)

  const {
    persistedMapCenter,
    persistedMapZoom,
    selectedObservationLayerUrl,
    selectedObservationOption,
    observationParameters,
    setPersistedMapCenter,
    setPersistedMapZoom,
    setSelectedObservationLayerUrl,
    setDatasetOptions,
    setObservationParameters,
    setSelectedObservationOption,
    datasetOptions,
    markerCoordinates,
    observationMarkerValue,
  } = useContext(ObservationsPageContext)

  const { mapContainer, mapRef, isMapLoaded } = useMap({
    center: persistedMapCenter ?? [0, 51.5],
    zoom: persistedMapZoom ?? 7,
    setPersistedMapCenter,
    setPersistedMapZoom,
  })
  const { updateCurrentPortfolioShown, isPortfolioLoading } =
    useAssetPortfolios({
      mapRef,
      isMapLoaded,
    })

  const use_cog_urls = selectedObservationLayerUrl?.endsWith('.tif') ?? false

  useGetObservationValueByMapclick({
    isMapLoaded,
    mapRef,
    use_cog_urls,
  })

  useUpdateObservationsMapTiles({
    isMapLoaded,
    mapRef,
    maxTemp,
    minTemp,
    selectedObservationLayerUrl,
    use_cog_urls,
    setIsMapLoading,
  })

  useEffect(() => {
    if (setDatasetOptions) {
      const { years, months, sensors, timeOfDay, observation } =
        observationParameters

      const flattenParameters = (array: AutoCompleteOption[]) =>
        array.map((input: AutoCompleteOption) => input.value)

      const flatYears = flattenParameters(years).map((year) => Number(year))
      const flatMonths = flattenParameters(months).map((year) => Number(year))
      const flatSensors = flattenParameters(sensors).map((sensor) =>
        sensor.toString(),
      )
      const flatTimeOfDay = flattenParameters(timeOfDay).map((timeOfDay) =>
        timeOfDay.toString(),
      )
      const flatObservation = flattenParameters(observation).map(
        (observation) => observation.toString(),
      )

      setLoadingDatasets(true)

      QuerySTACCatalog(
        flatYears,
        flatMonths,
        flatSensors,
        flatTimeOfDay,
        flatObservation,
      )
        .then((newDatasetOptions) => {
          setLoadingDatasets(false)
          setDatasetOptions(newDatasetOptions)
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn(error)
          toast.error('There was a problem retrieving available datasets')
          setDatasetOptions([DEFAULT_SELECTED_OBSERVATION])
        })
    }
  }, [observationParameters, setDatasetOptions])

  const handleAutoCompleteChange = (
    options: AutoCompleteOption[],
    type: string,
  ) => {
    setObservationParameters({
      ...observationParameters,
      [type]: options,
    })
  }

  const handleObservationChange = (
    _: SyntheticEvent,
    option: ObservationDatasetOption,
  ) => {
    setSelectedObservationOption(option)
    setSelectedObservationLayerUrl(option.value)
  }

  const handleSelectAssetsClick = () => {
    navigate('/assets')
  }

  const ObservationFilterSelect = ({
    value,
    options,
    filterType,
    label,
    showAllButton,
  }: ObservationFilterProps) => (
    <>
      <Autocomplete
        onChange={(_, option) => handleAutoCompleteChange(option, filterType)}
        size="small"
        disableClearable
        disablePortal
        fullWidth
        limitTags={3}
        multiple
        options={options}
        renderInput={(params) => (
          <MuiTextField
            slotProps={{ inputLabel: { shrink: true } }}
            {...params}
            label={label}
          />
        )}
        value={value}
      />
      {showAllButton && (
        <Button
          variant="soft"
          onClick={(event) => {
            event.preventDefault()
            handleAutoCompleteChange(options, filterType)
          }}
          size="2"
        >
          All
        </Button>
      )}
    </>
  )

  const sidebarContent = (
    <div className={sidebarStyles.content}>
      <div className={sidebarStyles.contentMidSection}>
        <form className={sidebarStyles.contentForm}>
          <InputLabelContainer>
            <div className={formStyles.labelWithInfoPopoverRow}>
              <label htmlFor="observation-date">Find Datasets</label>
            </div>
          </InputLabelContainer>
          <div className={formStyles.multipleInputsRow}>
            <ObservationFilterSelect
              value={observationParameters.years}
              options={VALID_OBSERVATION_YEARS}
              filterType="years"
              label="Years"
              showAllButton
            />
            <ObservationFilterSelect
              value={observationParameters.months}
              options={VALID_OBSERVATION_MONTHS}
              filterType="months"
              label="Months"
              showAllButton
            />
          </div>
          <div className={formStyles.multipleInputsRow}>
            <ObservationFilterSelect
              value={observationParameters.observation}
              options={AVAILABLE_OBSERVATION_TYPES}
              filterType="observation"
              label="Observation Type"
            />
            <ObservationFilterSelect
              value={observationParameters.timeOfDay}
              options={AVAILABLE_OBSERVATION_TIME_OF_DAY}
              filterType="timeOfDay"
              label="TIme of day"
            />
          </div>
          <div className={formStyles.multipleInputsRow}>
            <ObservationFilterSelect
              value={observationParameters.sensors}
              options={AVAILABLE_OBSERVATION_SENSORS}
              filterType="sensors"
              label="Sensors"
            />
          </div>
          <InputLabelContainer>
            <div className={formStyles.labelWithInfoPopoverRow}>
              <label htmlFor="observation-date">Datasets Available</label>
              {loadingDatasets && (
                <Box ml="1">
                  <Spinner />
                </Box>
              )}
            </div>
          </InputLabelContainer>
          <Autocomplete
            options={datasetOptions ?? []}
            onChange={handleObservationChange}
            getOptionKey={({ value }) => value?.toString() ?? ''}
            value={selectedObservationOption ?? DEFAULT_SELECTED_OBSERVATION}
            size="small"
            fullWidth
            disablePortal
            disableClearable
            renderInput={(params) => (
              <MuiTextField
                slotProps={{ inputLabel: { shrink: true } }}
                {...params}
              />
            )}
          />
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
                  Land Surface Temperature means radiative temperature of the outermost “skin” layer of a given surface. It is related to blackbody radiation at a given temperature, modified by spectral emissivity component.
                </p>
                <h3>
                  Citations:
                </h3>
                <h4>
                  1 - Sentinel 3A / 3B SLSTR data:
                </h4>
                <p>
                  <strong>Credit:</strong> University of Leicester, Surface Temperature Group, NCEO
                </p>
                <p>
                  <strong>Citation:</strong> Ghent, D., Anand, J. S., Veal, K., & Remedios, J. (2024). The Operational and Climate Land Surface Temperature Products from the Sea and Land Surface Temperature Radiometers on Sentinel-3A and 3B. Remote Sensing, 16(18), 3403.
                  <br/>
                  <a target='blank' href='https://www.researchgate.net/publication/384025841_The_Operational_and_Climate_Land_Surface_Temperature_Products_from_the_Sea_and_Land_Surface_Temperature_Radiometers_on_Sentinel-3A_and_3B'>
                    https://www.researchgate.net/publication/384025841_The_Operational_and_Climate_Land_Surface_Temperature_Products_from_the_Sea_and_Land_Surface_Temperature_Radiometers_on_Sentinel-3A_and_3B
                  </a>
                </p>
                <h4>
                  2 - Landsat, London (100m) data:
                </h4>
                <p>
                  <strong>Credit:</strong> University of Leicester, Surface Temperature Group, NCEO
                </p>
                <p>
                  <strong>Citation:</strong> Perry, M. J. S, Remedios, J. J, Ghent, D, Veal, K. L, Göttsche, F, A new inverse method for the retrieval of Land Surface Temperature and Emissivity from the ASTER instrument, AGU Earth and Space Science, (in review 2024)       
                </p>
              </Text>
{/* <Text size="3">
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
              </Text> */}
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

  const handleMinTempChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseFloat(event.target.value)

    if (numericValue < parseFloat(maxTemp) || isNaN(numericValue)) {
      setMinTemp(event.target.value)
    }
  }

  const handleMaxTempChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseFloat(event.target.value)
    if (numericValue > parseFloat(minTemp) || isNaN(numericValue)) {
      setMaxTemp(event.target.value)
    }
  }

  const legendUrl = `${HUB_BASE_URL}/titiler/core/colorMaps/jet?format=png`

  const legend = (
    <div className={observationStyles.legendWrapper}>
      <figure>
        <figcaption>Degrees Celsius</figcaption>
        <img src={legendUrl} alt="Color Map Legend" />
      </figure>

      <div className={observationStyles.legendInputWrapper}>
        <TextField.Root
          size="1"
          defaultValue={minTemp}
          onBlur={handleMinTempChange}
          type="number"
          aria-label="Minimum temperature to show on the map"
        />
        <TextField.Root
          size="1"
          defaultValue={maxTemp}
          onBlur={handleMaxTempChange}
          type="number"
          aria-label="Maximum temperature to show on the map"
        />
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

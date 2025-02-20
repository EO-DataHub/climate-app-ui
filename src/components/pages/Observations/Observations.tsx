import {
  Button,
  Flex,
  Select,
  Spinner,
  Tabs,
  Text,
  TextField,
} from '@radix-ui/themes'
import { useContext, useEffect, useState } from 'react'
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
import { GetKerchunkUrl } from '../../../library/api/getKerchunkUrl'

interface AutoCompleteOption {
  label: string
  value: number | string
}

const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL

const DEFAULT_MIN_TEMP = '-10'
const DEFAULT_MAX_TEMP = '45'
const VALID_OBSERVATION_YEARS = [
  {
    label: '2024',
    value: 2024,
  },
  {
    label: '2023',
    value: 2023,
  },
  {
    label: '2022',
    value: 2022,
  },
  {
    label: '2021',
    value: 2021,
  },
  {
    label: '2020',
    value: 2020,
  },
  {
    label: '2019',
    value: 2019,
  },
  {
    label: '2018',
    value: 2018,
  },
]
const VALID_OBSERVATION_MONTHS = [
  {
    label: 'January',
    value: 1,
  },
  {
    label: 'Februray',
    value: 2,
  },
  {
    label: 'March',
    value: 3,
  },
  {
    label: 'April',
    value: 4,
  },
  {
    label: 'May',
    value: 5,
  },
  {
    label: 'June',
    value: 6,
  },
  {
    label: 'July',
    value: 7,
  },
  {
    label: 'August',
    value: 8,
  },
  {
    label: 'September',
    value: 9,
  },
  {
    label: 'Ocotber',
    value: 10,
  },
  {
    label: 'November',
    value: 11,
  },
  {
    label: 'Februray',
    value: 12,
  },
]
const AVAILABLE_OBSERVATION_SENSORS = [
  {
    label: 'Sentinel 3A (1km)',
    value: 'sentinel3a',
  },
  {
    label: 'Sentinel 3B (1km)',
    value: 'sentinel3b',
  },
]
const AVAILABLE_OBSERVATION_TIME_OF_DAY = [
  {
    label: 'Day',
    value: 'day',
  },
  {
    label: 'Night',
    value: 'night',
  },
]
const AVAILABLE_OBSERVATION_REVISIT_PERIODS = [
  {
    label: 'Daily',
    value: 'daily',
  },
  {
    label: 'Monthly (Average)',
    value: 'monthly',
  },
]

const DEFAULT_OBSERVATION_PARAMETERS = {
  years: [VALID_OBSERVATION_YEARS[0]],
  months: [VALID_OBSERVATION_MONTHS[0]],
  sensors: [AVAILABLE_OBSERVATION_SENSORS[0]],
  timeOfDay: [AVAILABLE_OBSERVATION_TIME_OF_DAY[0]],
  revisitPeriod: [AVAILABLE_OBSERVATION_REVISIT_PERIODS[0]],
}

export const Observations = () => {
  const navigate = useNavigate()
  const { setIsMapLoading } = useContext(LoadingContext)
  const [minTemp, setMinTemp] = useState(DEFAULT_MIN_TEMP)
  const [maxTemp, setMaxTemp] = useState(DEFAULT_MAX_TEMP)

  const [observationParameters, setObservationParameters] = useState(
    DEFAULT_OBSERVATION_PARAMETERS,
  )

  const {
    persistedMapCenter,
    persistedMapZoom,
    selectedObservationLayerUrl = '',
    setPersistedMapCenter,
    setPersistedMapZoom,
    setSelectedObservationLayerUrl,
    setDatasetOptions,
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
      const { years, months, sensors, timeOfDay, revisitPeriod } =
        observationParameters

      const flattenParameters = (array: AutoCompleteOption[]) =>
        array.map((input: AutoCompleteOption) => input.value)

      const flatYears = flattenParameters(years).map((year) => Number(year))
      const flatMonths = flattenParameters(months).map((year) => Number(year))

      const sensorsParam = sensors.length > 1 ? 'all' : sensors[0]?.value
      const timeOfDayParam = timeOfDay.length > 1 ? 'all' : timeOfDay[0]?.value
      const revisitPeriodParam =
        revisitPeriod.length > 1 ? 'all' : revisitPeriod[0]?.value

      try {
        const newDatasetOptions = GetKerchunkUrl(
          flatYears,
          flatMonths,
          sensorsParam,
          timeOfDayParam,
          revisitPeriodParam,
        )

        setDatasetOptions(newDatasetOptions)
      } catch (error) {
        setDatasetOptions(undefined)
      }
    }
  }, [observationParameters, setDatasetOptions])

  const handleAutoCompleteChange = (
    value: AutoCompleteOption[],
    type: string,
  ) => {
    setObservationParameters({
      ...observationParameters,
      [type]: value,
    })
  }

  const handleSelectAssetsClick = () => {
    navigate('/assets')
  }

  const sidebarContent = (
    <div className={sidebarStyles.content}>
      <div className={sidebarStyles.contentMidSection}>
        <form className={sidebarStyles.contentForm}>
          <div className={formStyles.multipleInputsRow}>
            <Autocomplete
              onChange={(_, value) => handleAutoCompleteChange(value, 'years')}
              size="small"
              fullWidth
              multiple
              options={VALID_OBSERVATION_YEARS}
              renderInput={(params) => (
                <MuiTextField {...params} label="Year" />
              )}
              value={observationParameters.years}
            />
          </div>
          <div className={formStyles.multipleInputsRow}>
            <Autocomplete
              onChange={(_, value) => handleAutoCompleteChange(value, 'months')}
              size="small"
              fullWidth
              multiple
              options={VALID_OBSERVATION_MONTHS}
              renderInput={(params) => (
                <MuiTextField {...params} label="Month" />
              )}
              value={observationParameters.months}
            />
          </div>
          <div className={formStyles.multipleInputsRow}>
            <Autocomplete
              onChange={(_, value) =>
                handleAutoCompleteChange(value, 'sensors')
              }
              size="small"
              fullWidth
              multiple
              options={AVAILABLE_OBSERVATION_SENSORS}
              renderInput={(params) => (
                <MuiTextField {...params} label="Sensor" />
              )}
              value={observationParameters.sensors}
            />
          </div>
          <div className={formStyles.multipleInputsRow}>
            <Autocomplete
              onChange={(_, value) =>
                handleAutoCompleteChange(value, 'timeOfDay')
              }
              size="small"
              fullWidth
              multiple
              options={AVAILABLE_OBSERVATION_TIME_OF_DAY}
              renderInput={(params) => (
                <MuiTextField {...params} label="Time of day" />
              )}
              value={observationParameters.timeOfDay}
            />
          </div>
          <div className={formStyles.multipleInputsRow}>
            <Autocomplete
              onChange={(_, value) =>
                handleAutoCompleteChange(value, 'revisitPeriod')
              }
              size="small"
              fullWidth
              multiple
              options={AVAILABLE_OBSERVATION_REVISIT_PERIODS}
              renderInput={(params) => (
                <MuiTextField {...params} label="Revisit Period" />
              )}
              value={observationParameters.revisitPeriod}
            />
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
                {datasetOptions?.map((option) => (
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
          value={minTemp}
          onChange={handleMinTempChange}
          type="number"
          aria-label="Minimum temperature to show on the map"
        />
        <TextField.Root
          size="1"
          value={maxTemp}
          onChange={handleMaxTempChange}
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

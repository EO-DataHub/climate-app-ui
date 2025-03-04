import {
  useState,
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react'
import { LngLat } from 'maplibre-gl'
import {
  ObservationDatasetOption,
  DEFAULT_OBSERVATION_PARAMETERS,
  ObservationParameters,
} from '../library/api/fakeApiData'

export type ObservationMarkerValue = number | string | null

export interface ObservationsPageContextValue {
  markerCoordinates?: LngLat | undefined
  observationMarkerValue?: ObservationMarkerValue
  persistedMapCenter: LngLat | undefined
  persistedMapZoom: number | undefined
  selectedObservationLayerUrl?: string
  selectedObservationOption: ObservationDatasetOption | undefined
  datasetOptions: ObservationDatasetOption[] | undefined
  observationParameters: ObservationParameters
  setMarkerCoordinates?: Dispatch<SetStateAction<LngLat | undefined>>
  setObservationMarkerValue?: Dispatch<SetStateAction<ObservationMarkerValue>>
  setPersistedMapCenter?: Dispatch<SetStateAction<LngLat | undefined>>
  setPersistedMapZoom?: Dispatch<SetStateAction<number | undefined>>
  setSelectedObservationLayerUrl: Dispatch<SetStateAction<string | undefined>>
  setObservationParameters: Dispatch<SetStateAction<ObservationParameters>>
  setSelectedObservationOption: Dispatch<
    SetStateAction<ObservationDatasetOption | undefined>
  >
  setDatasetOptions?: Dispatch<
    SetStateAction<ObservationDatasetOption[] | undefined>
  >
}

export const ObservationsPageContext =
  createContext<ObservationsPageContextValue>({
    persistedMapCenter: undefined,
    persistedMapZoom: undefined,
    selectedObservationLayerUrl: '',
    datasetOptions: undefined,
    selectedObservationOption: undefined,
    observationParameters: DEFAULT_OBSERVATION_PARAMETERS,
    setSelectedObservationLayerUrl: useState,
    setObservationParameters: useState,
    setSelectedObservationOption: useState,
  })

export const ObservationsContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [persistedMapCenter, setPersistedMapCenter] = useState<LngLat>()
  const [persistedMapZoom, setPersistedMapZoom] = useState<number>()
  const [datasetOptions, setDatasetOptions] =
    useState<ObservationDatasetOption[]>()
  const [selectedObservationLayerUrl, setSelectedObservationLayerUrl] =
    useState<string>()
  const [selectedObservationOption, setSelectedObservationOption] =
    useState<ObservationDatasetOption>()
  const [observationParameters, setObservationParameters] =
    useState<ObservationParameters>(DEFAULT_OBSERVATION_PARAMETERS)

  const [markerCoordinates, setMarkerCoordinates] = useState<
    LngLat | undefined
  >()

  const [observationMarkerValue, setObservationMarkerValue] = useState<
    number | string | null
  >(null)

  return (
    <ObservationsPageContext.Provider
      value={{
        markerCoordinates,
        observationMarkerValue,
        persistedMapCenter,
        persistedMapZoom,
        datasetOptions,
        observationParameters,
        selectedObservationLayerUrl,
        selectedObservationOption,
        setMarkerCoordinates,
        setObservationMarkerValue,
        setPersistedMapCenter,
        setPersistedMapZoom,
        setSelectedObservationLayerUrl,
        setDatasetOptions,
        setSelectedObservationOption,
        setObservationParameters,
      }}
    >
      {children}
    </ObservationsPageContext.Provider>
  )
}

import {
  useState,
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react'
import { LngLat } from 'maplibre-gl'
import { ObservationDatasetOption } from '../library/api/fakeApiData'

export type ObservationMarkerValue = number | string | null

export interface ObservationsPageContextValue {
  markerCoordinates?: LngLat | undefined
  observationMarkerValue?: ObservationMarkerValue
  persistedMapCenter: LngLat | undefined
  persistedMapZoom: number | undefined
  selectedObservationLayerUrl?: string
  datasetOptions: ObservationDatasetOption[] | undefined
  setMarkerCoordinates?: Dispatch<SetStateAction<LngLat | undefined>>
  setObservationMarkerValue?: Dispatch<SetStateAction<ObservationMarkerValue>>
  setPersistedMapCenter?: Dispatch<SetStateAction<LngLat | undefined>>
  setPersistedMapZoom?: Dispatch<SetStateAction<number | undefined>>
  setSelectedObservationLayerUrl?: Dispatch<SetStateAction<string | undefined>>
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
        selectedObservationLayerUrl,
        setMarkerCoordinates,
        setObservationMarkerValue,
        setPersistedMapCenter,
        setPersistedMapZoom,
        setSelectedObservationLayerUrl,
        setDatasetOptions,
      }}
    >
      {children}
    </ObservationsPageContext.Provider>
  )
}

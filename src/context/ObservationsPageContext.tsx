import {
  useState,
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react'
import { LngLat } from 'maplibre-gl'
import {
  observationTypeConfigs,
  observationMenuItemsLondon,
  ObservationTypeConfig,
} from '../library/api/fakeApiData'

interface ObservationContextValue {
  persistedMapCenter: LngLat | undefined
  persistedMapZoom: number | undefined
  selectedObservationLayerUrl: string
  selectedObservationType: string
  setPersistedMapCenter?: Dispatch<SetStateAction<LngLat | undefined>>
  setPersistedMapZoom?: Dispatch<SetStateAction<number | undefined>>
  setSelectedObservationLayerUrl?: Dispatch<SetStateAction<string>>
  setSelectedObservationType?: Dispatch<SetStateAction<string>>
  selectedObservationTypeConfig?: ObservationTypeConfig | undefined
  observationTypeConfigs?: ObservationTypeConfig[] | undefined
}
export const ObservationsPageContext = createContext<ObservationContextValue>({
  persistedMapCenter: undefined,
  persistedMapZoom: undefined,
  selectedObservationLayerUrl: observationMenuItemsLondon[0].value,
  selectedObservationType: 'london',
})

export const ObservationsContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [persistedMapCenter, setPersistedMapCenter] = useState<LngLat>()
  const [persistedMapZoom, setPersistedMapZoom] = useState<number>()
  const [selectedObservationType, setSelectedObservationType] = useState(
    observationTypeConfigs[0].value,
  )
  const [selectedObservationLayerUrl, setSelectedObservationLayerUrl] =
    useState(observationTypeConfigs[0].datasetOptions[0].value)

  const selectedObservationTypeConfig = observationTypeConfigs.find(
    (observationTypeConfig) =>
      observationTypeConfig.value === selectedObservationType,
  )

  return (
    <ObservationsPageContext.Provider
      value={{
        persistedMapCenter,
        persistedMapZoom,
        selectedObservationLayerUrl,
        selectedObservationType,
        setPersistedMapCenter,
        setPersistedMapZoom,
        setSelectedObservationLayerUrl,
        setSelectedObservationType,
        selectedObservationTypeConfig,
        observationTypeConfigs,
      }}
    >
      {children}
    </ObservationsPageContext.Provider>
  )
}

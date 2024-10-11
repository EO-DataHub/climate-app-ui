import {
  useState,
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react'
import { LngLat } from 'maplibre-gl'
import { observationMenuItems } from '../library/api/fakeApiData'

interface ObservationContextValue {
  persistedMapCenter: LngLat | undefined
  persistedMapZoom: number | undefined
  selectedObservationLayerUrl: string
  selectedObservationType: string
  setPersistedMapCenter?: Dispatch<SetStateAction<LngLat | undefined>>
  setPersistedMapZoom?: Dispatch<SetStateAction<number | undefined>>
  setSelectedObservationLayerUrl?: Dispatch<SetStateAction<string>>
  setSelectedObservationType?: Dispatch<SetStateAction<string>>
}
export const ObservationsPageContext = createContext<ObservationContextValue>({
  persistedMapCenter: undefined,
  persistedMapZoom: undefined,
  selectedObservationLayerUrl: observationMenuItems[0].value,
  selectedObservationType: 'london',
})

export const ObservationsContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [persistedMapCenter, setPersistedMapCenter] = useState<LngLat>()
  const [persistedMapZoom, setPersistedMapZoom] = useState<number>()
  const [selectedObservationType, setSelectedObservationType] =
    useState('london')
  const [selectedObservationLayerUrl, setSelectedObservationLayerUrl] =
    useState(observationMenuItems[0].value)

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
      }}
    >
      {children}
    </ObservationsPageContext.Provider>
  )
}

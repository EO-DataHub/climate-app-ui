import {
  useState,
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react'
import { LngLat } from 'maplibre-gl'

interface ObservationContextValue {
  persistedMapCenter: LngLat | undefined
  persistedMapZoom: number | undefined
  setPersistedMapZoom?: Dispatch<SetStateAction<number | undefined>>
  setPersistedMapCenter?: Dispatch<SetStateAction<LngLat | undefined>>
}
export const ObservationsContext = createContext<ObservationContextValue>({
  persistedMapCenter: undefined,
  persistedMapZoom: undefined,
})

export const ObservationsContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [persistedMapCenter, setPersistedMapCenter] = useState<LngLat>()
  const [persistedMapZoom, setPersistedMapZoom] = useState<number>()

  return (
    <ObservationsContext.Provider
      value={{
        persistedMapCenter,
        persistedMapZoom,
        setPersistedMapCenter,
        setPersistedMapZoom,
      }}
    >
      {children}
    </ObservationsContext.Provider>
  )
}

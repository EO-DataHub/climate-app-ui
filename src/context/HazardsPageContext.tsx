import {
  useEffect,
  useState,
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react'
import {
  climateModelOptions,
  getOptionsByClimateModel,
  indicatorOptions,
} from '../library/api/fakeApiData'
import { LngLat } from 'maplibre-gl'

interface HazardsContextValue {
  climateModel: string
  hazardIndicator: string
  persistedMapCenter: LngLat | undefined
  persistedMapZoom: number | undefined
  scenario: string
  setClimateModel?: Dispatch<SetStateAction<string>>
  setHazardIndicator?: Dispatch<SetStateAction<string>>
  setPersistedMapZoom?: Dispatch<SetStateAction<number | undefined>>
  setPersistedMapCenter?: Dispatch<SetStateAction<LngLat | undefined>>
  setScenario?: Dispatch<SetStateAction<string>>
  setYear?: Dispatch<SetStateAction<string>>
  year: string
}
export const HazardsPageContext = createContext<HazardsContextValue>({
  climateModel: '',
  hazardIndicator: '',
  scenario: '',
  year: '',
  persistedMapCenter: undefined,
  persistedMapZoom: undefined,
})

export const HazardContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [climateModel, setClimateModel] = useState(climateModelOptions[0].value)
  const [hazardIndicator, setHazardIndicator] = useState(
    indicatorOptions[0].value,
  )
  const [scenario, setScenario] = useState('')
  const [year, setYear] = useState('')
  const [persistedMapCenter, setPersistedMapCenter] = useState<LngLat>()
  const [persistedMapZoom, setPersistedMapZoom] = useState<number>()

  useEffect(
    function setScenrioAndYearDefaultFromClimateModel() {
      const { scenarioOptions, yearOptions } =
        getOptionsByClimateModel(climateModel)
      setScenario(scenarioOptions[0].value)
      setYear(yearOptions[0])
    },
    [climateModel],
  )
  return (
    <HazardsPageContext.Provider
      value={{
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
      }}
    >
      {children}
    </HazardsPageContext.Provider>
  )
}

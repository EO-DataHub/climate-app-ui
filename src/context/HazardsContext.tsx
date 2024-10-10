import { useEffect, useState, ReactNode, createContext } from 'react'
import {
  climateModelOptions,
  getOptionsByClimateModel,
  indicatorOptions,
} from '../library/api/fakeApiData'

interface HazardContextValue {
  climateModel: string
  hazardIndicator: string
  scenario: string
  setClimateModel?: React.Dispatch<React.SetStateAction<string>>
  setHazardIndicator?: React.Dispatch<React.SetStateAction<string>>
  setScenario?: React.Dispatch<React.SetStateAction<string>>
  setYear?: React.Dispatch<React.SetStateAction<string>>
  year: string
}
export const HazardContext = createContext<HazardContextValue>({
  climateModel: '',
  hazardIndicator: '',
  scenario: '',
  year: '',
})

export const HazardContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [hazardIndicator, setHazardIndicator] = useState(
    indicatorOptions[0].value,
  )

  const [climateModel, setClimateModel] = useState(climateModelOptions[0].value)
  const [scenario, setScenario] = useState('')

  const [year, setYear] = useState('')

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
    <HazardContext.Provider
      value={{
        climateModel,
        hazardIndicator,
        scenario,
        setClimateModel,
        setHazardIndicator,
        setScenario,
        setYear,
        year,
      }}
    >
      {children}
    </HazardContext.Provider>
  )
}

import { Select } from '@radix-ui/themes'
import { useContext } from 'react'

import { ObservationsPageContext } from '../../../context/ObservationsPageContext'

export const ObservationsMenu = () => {
  const {
    selectedObservationLayerUrl,
    setSelectedObservationLayerUrl,
    selectedObservationTypeConfig,
  } = useContext(ObservationsPageContext)

  const datasetOptions = selectedObservationTypeConfig?.datasetOptions ?? []

  return (
    <Select.Root
      value={selectedObservationLayerUrl}
      onValueChange={setSelectedObservationLayerUrl}
    >
      <Select.Trigger placeholder="Select" />
      <Select.Content id="observation-date">
        {datasetOptions.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}

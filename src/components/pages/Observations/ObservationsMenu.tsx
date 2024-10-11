import { Select } from '@radix-ui/themes'
import { useState, useEffect, useContext } from 'react'
import {
  observationMenuItems,
  observationMenuItemsUK,
} from '../../../library/api/fakeApiData'
import { ObservationsContext } from '../../../context/ObservationsContext'

interface Option {
  value: string
  label: string
}

export const ObservationsMenu = () => {
  const {
    selectedObservationLayerUrl,
    selectedObservationType,
    setSelectedObservationLayerUrl,
  } = useContext(ObservationsContext)
  const [options, setOptions] = useState<Option[]>([])

  useEffect(
    function updateDateOptionsDependingOnObservationType() {
      if (selectedObservationType === 'london') {
        setOptions(observationMenuItems)
      } else if (selectedObservationType === 'uk') {
        setOptions(observationMenuItemsUK)
      } else {
        setOptions([])
      }
    },
    [selectedObservationType],
  )
  return (
    <Select.Root
      value={selectedObservationLayerUrl}
      onValueChange={setSelectedObservationLayerUrl}
    >
      <Select.Trigger placeholder="Select" />
      <Select.Content id="observation-date">
        {options.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}

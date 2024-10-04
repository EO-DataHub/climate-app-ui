import { Select } from '@radix-ui/themes'
import { useState, useEffect } from 'react'
import {
  observationMenuItems,
  observationMenuItemsUK,
} from '../../../library/api/fakeApiData'

interface Option {
  value: string
  label: string
}

interface ObservationsMenuProps {
  selectedObservationLayerUrl: string
  setSelectedObservationLayerUrl: (value: string) => void
  observationType: string
}

export const ObservationsMenu = ({
  selectedObservationLayerUrl,
  setSelectedObservationLayerUrl,
  observationType,
}: ObservationsMenuProps) => {
  const [options, setOptions] = useState<Option[]>([])

  useEffect(
    function updateDateOptionsDependingOnObservationType() {
      if (observationType === 'london') {
        setOptions(observationMenuItems)
      } else if (observationType === 'uk') {
        setOptions(observationMenuItemsUK)
      } else {
        setOptions([])
      }
    },
    [observationType],
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

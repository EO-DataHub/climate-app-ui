import { Select } from '@radix-ui/themes'
import { useState } from 'react'
import { observationMenuItems } from '../../../library/api/fakeApiData'

interface Option {
  value: string
  label: string
}

interface ObservationsMenuProps {
  selectedObservationLayerUrl: string
  setSelectedObservationLayerUrl: (value: string) => void
}

export const ObservationsMenu = ({
  selectedObservationLayerUrl,
  setSelectedObservationLayerUrl,
}: ObservationsMenuProps) => {
  const [options] = useState<Option[]>(observationMenuItems)

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

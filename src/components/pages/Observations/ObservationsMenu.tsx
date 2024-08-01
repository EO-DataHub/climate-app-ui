import { Select } from '@radix-ui/themes'
import { useState } from 'react'
import { observationMenuItems } from '../../../library/api/fakeApiData'

interface Option {
  value: string
  label: string
}

interface ObservationsMenuProps {
  selectedObservationLayerId: string
  setSelectedObservationLayerId: (value: string) => void
}

export const ObservationsMenu = ({
  selectedObservationLayerId,
  setSelectedObservationLayerId,
}: ObservationsMenuProps) => {
  const [options] = useState<Option[]>(observationMenuItems)

  return (
    <Select.Root
      value={selectedObservationLayerId}
      onValueChange={setSelectedObservationLayerId}
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

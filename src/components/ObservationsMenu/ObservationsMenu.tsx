import { Select } from '@radix-ui/themes'
import { useState } from 'react'
import { observationMenuItems } from '../../library/api/fakeApiData'

interface Option {
  value: string
  label: string
}

interface ObservationsMenuProps {
  selected: string
  setSelected: (value: string) => void
}

export const ObservationsMenu = ({
  selected,
  setSelected,
}: ObservationsMenuProps) => {
  const [options] = useState<Option[]>(observationMenuItems)

  return (
    <Select.Root value={selected} onValueChange={setSelected}>
      <Select.Trigger placeholder="Select" />
      <Select.Content id="filter-2">
        {options.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}

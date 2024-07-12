import { Select } from '@radix-ui/themes'
import { useEffect, useState } from 'react'

interface Option {
  value: string
  label: string
}

export const ObservationsMenu = () => {
  const [options, setOptions] = useState<Option[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('./lst_files.json')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        const formattedOptions = Object.keys(data).map((timestamp) => {
          return { value: timestamp, label: timestamp }
        })
        setOptions(formattedOptions)
        if (formattedOptions.length > 0) {
          setSelected(formattedOptions[0].value) // Select the first option by default
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error loading data')
      } finally {
        setLoading(false)
      }
    }

    fetchData().catch((error) => {
      const message =
        error instanceof Error ? error.message : 'Error in fetchData'
      throw new Error(message)
    })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

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

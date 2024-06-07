export interface LegendParameters {
  intervalRgbaColor: string[]
  intervals: number[][]
}

export const indicatorOptions = [
  {
    value: 'days_tas_above_20c',
    label: 'Days with average temperature above 20°C',
  },
  {
    value: 'days_tas_above_28c',
    label: 'Days with average temperature above 28°C',
  },
  {
    value: 'days_tas_above_32c',
    label: 'Days with average temperature above 32°C',
  },
  {
    value: 'mean_degree_days_v2_above_28c',
    label: 'Mean degree days above 28°C',
  },
  {
    value: 'mean_degree_days_v2_above_32c',
    label: 'Mean degree days above 32°C',
  },
]

export const climateModelOptions = [
  { value: 'ACCESS-CM2', label: 'CMIP6: ACCESS-CM2' },
  { value: 'NorESM2-MM', label: 'CMIP6: NorESM2-MM' },
]

export const scenarioOptions = [
  { value: 'ssp126', label: 'SSP1-2.6' },
  { value: 'ssp585', label: 'SSP5-8.5' },
]
export const yearOptions = ['2070', '2080']

export const legendParameters = {
  daysWithAverageTemperatureAbove: {
    intervalRgbaColor: [
      '254,229,217',
      '252,187,161',
      '252,146,114',
      '251,106,74',
      '239,59,44',
      '203,24,29',
      '153,0,13',
    ],
    intervals: [
      [0, 50],
      [50, 100],
      [100, 150],
      [150, 200],
      [200, 250],
      [250, 300],
      [300, 365],
    ],
  },
  meanDegreeDaysAbove: {
    intervalRgbaColor: [
      '255,245,240',
      '254,224,210',
      '252,187,161',
      '252,146,114',
      '251,106,74',
      '239,59,44',
      '203,24,29',
      '153,0,13',
    ],
    intervals: [
      [0, 50],
      [50, 100],
      [100, 150],
      [150, 200],
      [200, 250],
      [250, 300],
      [300, 350],
      [350, 400],
    ],
  },
}

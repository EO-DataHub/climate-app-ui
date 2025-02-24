import { ObservationDatasetOption } from './fakeApiData.ts'
import axios, { AxiosResponse } from 'axios'

const SEARCH_URL = import.meta.env.VITE_CATALOG_SEARCH_URL
const PAGE_SIZE = Number(import.meta.env.VITE_CATALOG_PAGE_SIZE)

interface Feature {
  collection: string
  properties: {
    datetime: string
    platform: string
    'lst:type': string | undefined
    'lst:time_of_day': string | undefined
    'day_night': string | undefined
  }
  assets: {
    reference_file: {
      href: string
    }
  }
}

interface FeatureCollection {
  features: Feature[]
}

export async function QuerySTACCatalog(
  years: number[],
  months: number[],
  sensor: string[],
  timeOfDay: string[],
  period: string[],
): Promise<ObservationDatasetOption[]> {
  const query = buildCQL2Query(years, months, sensor, timeOfDay, period)
  const results = await executeCQL2Query(query)
  return buildLSTParamsFromSTAC(results)
}

function buildCQL2Query(
  years: number[],
  months: number[],
  sensors: string[],
  timeOfDays: string[],
  periods: string[],
): object {
  const dateArgs = []

  for (const year of years) {
    for (const month of months) {
      const numberOfDays = new Date(year, month, 0).getDate()
      const monthPad = month.toString().padStart(2, '0')

      dateArgs.push({
        op: 'and',
        args: [
          {
            op: '>=',
            args: [
              {
                property: 'properties.datetime',
              },
              `${year}-${monthPad}-01`,
            ],
          },
          {
            op: '<=',
            args: [
              {
                property: 'properties.datetime',
              },
              `${year}-${monthPad}-${numberOfDays}`,
            ],
          },
        ],
      })
    }
  }

  const dateQuery = {
    op: 'or',
    args: dateArgs,
  }

  const prettySat = sensors.map((sensor) => {
    return sensor === 'sentinel3a' ? 'Sentinel3A' : 'Sentinel3B'
  })

  const sensorQuery = {
    op: 'in',
    args: [
      {
        property: 'properties.platform',
      },
      prettySat,
    ],
  }

  const collections = []

  for (const period of periods) {
    for (const timeOfDay of timeOfDays) {
      for (const sensor of sensors) {
        const shortSat = sensor === 'sentinel3a' ? 's3a' : 's3b'

        if (period === 'daily') {
          if (sensor === 'landsat') {
            collections.push(`col_f99e920a-a58e-11ef-aab0-7a33b70d8782`)
          } else {
            collections.push(`eocis-lst-${shortSat}-${timeOfDay}`)
          }
        } else {
          collections.push(`esacci-lst-${shortSat}-${timeOfDay}-monthly`)
        }
      }
    }
  }

  const collectionQuery = {
    op: 'in',
    args: [
      {
        property: 'collection',
      },
      collections,
    ],
  }

  return {
    limit: PAGE_SIZE,
    fields: {
      include: ['properties'],
    },
    filter: {
      op: 'and',
      args: [collectionQuery, sensorQuery, dateQuery],
    },
    sortBy: {
      field: 'properties.datetime',
      direction: 'desc',
    },
  }
}

async function executeCQL2Query(query: object): Promise<FeatureCollection> {
  async function _runQuery(query: object) {
    return await axios.post(SEARCH_URL, query)
  }

  try {
    const result: AxiosResponse<FeatureCollection> = await _runQuery(query)
    return result.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error
    } else {
      throw new Error('Unknown error')
    }
  }
}

function buildLSTParamsFromSTAC(
  results: FeatureCollection,
): ObservationDatasetOption[] {
  return results.features.map((feature) => {
    const date = new Date(feature.properties.datetime)

    const year = date.getUTCFullYear()
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const day = date.getUTCDate().toString().padStart(2, '0')
    const prettySat = feature.properties.platform ?? 'Landsat, London (100m)'
    const timeOfDay =
      feature.properties['lst:time_of_day'] ?? feature.properties.day_night ??
      feature.collection.substring(feature.collection.lastIndexOf('-') + 1)
    const period = feature.properties['lst:type'] ?? 'daily'

    const dataset: ObservationDatasetOption = {
      value: feature.assets.reference_file.href,
      label: `${year}-${month}-${day} ${prettySat} ${timeOfDay} ${period}`,
      date: `${year}-${month}-${day}`,
      sensor: prettySat,
      day_night: timeOfDay,
    }

    return dataset
  })
}

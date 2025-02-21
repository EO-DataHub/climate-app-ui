import { ObservationDatasetOption } from './fakeApiData.ts'
import axios, { AxiosResponse } from 'axios'

interface LSTParams {
  year: number
  month: number
  sensor: string
  timeOfDay: string
  period: string
  url: string | undefined
}

interface Feature {
  collection: string,
  properties: {
    datetime: string,
    platform: string,
    "lst:type": string | undefined,
  },
  assets: {
    reference_file: {
      href: string,
    }
  }
}

interface FeatureCollection {
  features: Feature[]
}

export function GetKerchunkUrl(
  years: number[],
  months: number[],
  sensor: string,
  timeOfDay: string,
  period: string,
): ObservationDatasetOption[] {
  validate(sensor, timeOfDay, period)
  const params = expandParameters(years, months, sensor, timeOfDay, period)
  return buildURLs(params)
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
  const params = buildLSTParamsFromSTAC(results)
  return buildURLs(params)
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

      dateArgs.push(
        {
          'op': 'and',
          'args': [
            {
              'op': '>=',
              'args': [
                {
                  'property': 'properties.datetime',
                },
                `${year}-${monthPad}-01`,
              ],
            },
            {
              'op': '<=',
              'args': [
                {
                  'property': 'properties.datetime',
                },
                `${year}-${monthPad}-${numberOfDays}`,
              ],
            },
          ],
        },
      )
    }
  }

  const dateQuery = {
    'op': 'or',
    'args': dateArgs,
  }

  const prettySat = sensors.map(sensor => {
    return sensor === 'sentinel3a' ? 'Sentinel3A' : 'Sentinel3B'
  })

  const sensorQuery = {
    'op': 'in',
    'args': [
      {
        'property': 'properties.platform',
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
          collections.push(`eocis-lst-${shortSat}-${timeOfDay}`)
        } else {
          collections.push(`eocis-lst-${shortSat}-${timeOfDay}-whatever`)
        }
      }
    }
  }

  const collectionQuery = {
    'op': 'in',
    'args': [
      {
        'property': 'collection',
      },
      collections,
    ],
  }

  return {
    'fields': {
      'include': [
        'properties'
      ]
    },
    'filter': {
      'op': 'and',
      'args': [
        collectionQuery, sensorQuery, dateQuery,
      ],
    },
  }
}

async function executeCQL2Query(query: object): Promise<FeatureCollection> {
  async function _runQuery(query: object) {
    return await axios.post('https://test.eodatahub.org.uk/api/catalogue/stac/' + 'search', query)
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

function buildLSTParamsFromSTAC(results: FeatureCollection): LSTParams[] {
  return results.features.map((feature) => {
    const date = new Date(feature.properties.datetime)
    const param: LSTParams = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      sensor: feature.properties.platform.toLowerCase(),
      timeOfDay: feature.collection.slice(feature.collection.lastIndexOf("-") + 1),
      period: feature.properties['lst:type'] ?? "daily",
      url: feature.assets.reference_file.href,
    }
    return param;
  })
}

function expandParameters(
  years: number[],
  months: number[],
  sensor: string,
  timeOfDay: string,
  period: string,
): LSTParams[] {
  const p_years: LSTParams[] = []

  for (const year of years) {
    for (const month of months) {
      const param: LSTParams = {
        year: year,
        month: month,
        sensor: sensor,
        timeOfDay: timeOfDay,
        period: period,
        url: undefined
      }

      p_years.push(param)
    }
  }

  const p: LSTParams[] = []

  for (const param of p_years) {
    if (param.sensor === 'all') {
      const a = { ...param }
      a.sensor = 'sentinel3a'
      p.push(a)
      const b = { ...param }
      b.sensor = 'sentinel3b'
      p.push(b)
    } else {
      p.push(param)
    }
  }

  const params: LSTParams[] = []

  for (const pItem of p) {
    if (pItem.timeOfDay === 'all') {
      const day = { ...pItem }
      day.timeOfDay = 'day'
      params.push(day)
      const night = { ...pItem }
      night.timeOfDay = 'night'
      params.push(night)
    } else {
      params.push(pItem)
    }
  }
  return params
}

function buildURLs(params: LSTParams[]) {
  // Example URL:
  // "https://eocis.org/data/eocis-lst-s3a-night-kerchunk/2024/01/EOCIS_-LST-L3C-LST-SLSTRA-0.01deg_1DAILY_NIGHT-20240101000000-fv4.00-kerchunk.json"
  const output: ObservationDatasetOption[] = []

  for (const param of params) {
    const numberOfDays =
      param.period === 'monthly'
        ? 1
        : new Date(param.year, param.month, 0).getDate()

    const shortSat = param.sensor === 'sentinel3a' ? 's3a' : 's3b'
    const time = param.timeOfDay
    const year = param.year
    const month = param.month.toString().padStart(2, '0')
    const longSat = param.sensor === 'sentinel3a' ? 'SLSTRA' : 'SLSTRB'
    const prettySat =
      param.sensor === 'sentinel3a' ? 'Sentinel 3A' : 'Sentinel 3B'
    const type = param.period.toUpperCase()
    const timeOfDay = param.timeOfDay.toUpperCase()

    for (let i = 1; i <= numberOfDays; i++) {
      const day = i.toString().padStart(2, '0')
      let URL = `https://leicester-lst-monthly.s3.eu-west-1.amazonaws.com/ESACCI-LST-L3C-LST-${longSat}-0.01deg_1${type}_${timeOfDay}-${year}${month}${day}000000-fv4.00.json`

      if (type === "daily") {
        URL = `https://eocis.org/data/eocis-lst-${shortSat}-${time}-kerchunk/${year}/${month}/EOCIS_-LST-L3C-LST-${longSat}-0.01deg_1${type}_${timeOfDay}-${year}${month}${day}000000-fv4.00-kerchunk.json`
      }

      const dataset: ObservationDatasetOption = {
        value: param.url ?? URL,
        label: `${year}-${month}-${day} ${prettySat} ${timeOfDay}`,
        date: `${year}-${month}-${day}`,
        sensor: prettySat,
        day_night: timeOfDay,
      }
      output.push(dataset)
    }
  }

  return output
}

function validate(sensor: string, timeOfDay: string, period: string) {
  if (!['sentinel3a', 'sentinel3b', 'all'].some((x) => x === sensor)) {
    throw new Error(`Invalid sensor value "${sensor}"`)
  }

  if (!['day', 'night', 'all'].some((x) => x === timeOfDay)) {
    throw new Error(`Invalid time of day "${timeOfDay}"`)
  }

  if (!['daily', 'monthly'].some((x) => x === period)) {
    throw new Error(`Invalid type "${period}"`)
  }
}

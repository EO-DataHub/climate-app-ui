import { ObservationDatasetOption } from './fakeApiData.ts'

interface LSTParams {
  year: number
  month: number
  sensor: string // ["sentinel3a", "sentinel3b", "all"]
  timeOfDay: string // ["day", "night", "all"]
  period: string // ["daily", "monthly"]
}

export function GetKerchunkUrl(years: number[], months: number[], sensor: string, timeOfDay: string, period: string): ObservationDatasetOption[] {
  validate(sensor, timeOfDay, period)

  const p_years: LSTParams[] = []

  for (const year of years) {
    for (const month of months) {
      const param: LSTParams = {
        year: year,
        month: month,
        sensor: sensor,
        timeOfDay: timeOfDay,
        period: period,
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

  const pp: LSTParams[] = []

  for (const pItem of p) {
    if (pItem.timeOfDay === 'all') {
      const day = { ...pItem }
      day.timeOfDay = 'day'
      pp.push(day)
      const night = { ...pItem }
      night.timeOfDay = 'night'
      pp.push(night)
    } else {
      pp.push(pItem)
    }
  }

  // const foo: string = "https://eocis.org/data/eocis-lst-s3a-night-kerchunk/2024/01/EOCIS_-LST-L3C-LST-SLSTRA-0.01deg_1DAILY_NIGHT-20240101000000-fv4.00-kerchunk.json";
  const output: ObservationDatasetOption[] = []

  for (const param of pp) {
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
      const URL = `https://eocis.org/data/eocis-lst-${shortSat}-${time}-kerchunk/${year}/${month}/EOCIS_-LST-L3C-LST-${longSat}-0.01deg_1${type}_${timeOfDay}-${year}${month}${day}000000-fv4.00-kerchunk.json`

      const dataset: ObservationDatasetOption = {
        value: URL,
        label: `${year}-${month}-${day} ${shortSat.toUpperCase()} ${timeOfDay}`,
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

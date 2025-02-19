import { ObservationDatasetOption } from './fakeApiData.ts'

export interface LSTParams {
  year: number
  month: number
  sensor: string // ["sentinel3a", "sentinel3b", "all"]
  timeOfDay: string // ["day", "night", "all"]
  type: string // ["daily", "monthly"]
}

export function GetKerchunkUrl(params: LSTParams): ObservationDatasetOption[] {
  validate(params)

  const p: LSTParams[] = []

  if (params.sensor === 'all') {
    const a = { ...params }
    a.sensor = 'sentinel3a'
    p.push(a)
    const b = { ...params }
    b.sensor = 'sentinel3b'
    p.push(b)
  } else {
    p.push(params)
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
  const numberOfDays =
    params.type === 'monthly'
      ? 1
      : new Date(params.year, params.month, 0).getDate()

  for (const param of pp) {
    const shortSat = param.sensor === 'sentinel3a' ? 's3a' : 's3b'
    const time = param.timeOfDay
    const year = param.year
    const month = param.month.toString().padStart(2, '0')
    const longSat = param.sensor === 'sentinel3a' ? 'SLSTRA' : 'SLSTRB'
    const prettySat =
      param.sensor === 'sentinel3a' ? 'Sentinel 3A' : 'Sentinel 3B'
    const type = param.type.toUpperCase()
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

function validate(params: LSTParams) {
  if (!['sentinel3a', 'sentinel3b', 'all'].some((x) => x === params.sensor)) {
    throw new Error(`Invalid sensor value "${params.sensor}"`)
  }

  if (!['day', 'night', 'all'].some((x) => x === params.timeOfDay)) {
    throw new Error(`Invalid time of day "${params.timeOfDay}"`)
  }

  if (!['daily', 'monthly'].some((x) => x === params.type)) {
    throw new Error(`Invalid type "${params.type}"`)
  }
}

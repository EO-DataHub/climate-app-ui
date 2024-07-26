// @ts-expect-error - no types available
import { csv2geojson as getGeojsonFromCsv } from 'csv2geojson'
import { FeatureCollection, Point } from 'geojson'

import { getIsFileCsv, getIsFileGeoJson } from '../fileTypes'
import { UserAssets } from './userAssetTypes'
const doesGeoJsonContainRequiredProperties = (
  geoJson: FeatureCollection<Point>,
) =>
  geoJson.features.every((feature) => {
    return (
      !!feature.properties?.id &&
      typeof feature.geometry?.coordinates?.[0] === 'number' &&
      typeof feature.geometry?.coordinates?.[1] === 'number'
    )
  })

export const parseUploadedAssetsIntoGeoJson = (uploadedFile: File) => {
  return new Promise<UserAssets>((resolve, reject) => {
    const isCsv = getIsFileCsv(uploadedFile)
    const isGeoJson = getIsFileGeoJson(uploadedFile)

    const fileReader = new FileReader()

    fileReader.onload = function () {
      const fileContents = fileReader.result as string
      if (typeof fileContents !== 'string' || !fileContents) {
        reject('Error reading file contents')
      }

      if (isGeoJson) {
        try {
          const parsedFileContents = JSON.parse(fileContents)
          if (!doesGeoJsonContainRequiredProperties(parsedFileContents)) {
            reject(
              "GeoJSON file must contain an 'id' field within each feature's properties object",
            )
          }
          resolve(parsedFileContents)
        } catch (error) {
          reject(error)
        }
      }
      if (isCsv) {
        const headers = fileContents
          ?.slice(0, fileContents?.indexOf('\n'))
          .split(',')

        if (
          !headers.includes('id') ||
          !headers.includes('latitude') ||
          !headers.includes('longitude')
        ) {
          reject("CSV file must contain 'id','latitude', and 'longitude'")
        }

        getGeojsonFromCsv(
          fileContents,
          {
            latfield: 'latitude',
            lonfield: 'longitude',
            delimiter: ',',
          },
          function (error: Error | null, data: FeatureCollection | null) {
            if (!data || error) {
              reject(error)
            }
            resolve(data as UserAssets)
          },
        )
      }

      reject('Unsupported file type')
    }

    fileReader.readAsText(uploadedFile)
  })
}

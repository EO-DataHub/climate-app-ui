// @ts-expect-error - no types available
import { csv2geojson as getGeojsonFromCsv } from 'csv2geojson'
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson'

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

const copyUppercaseIdToLowercaseId = (geoJson: FeatureCollection<Point>) => {
  return {
    ...geoJson,
    features: geoJson.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        id: feature.properties?.ID || feature.properties?.id,
      },
    })),
  }
}

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
          const reformattedParsedFileContents =
            copyUppercaseIdToLowercaseId(parsedFileContents)

          if (
            !doesGeoJsonContainRequiredProperties(reformattedParsedFileContents)
          ) {
            reject(
              "GeoJSON file must contain an 'id' field within each feature's properties object",
            )
          }
          resolve(reformattedParsedFileContents as UserAssets)
        } catch (error) {
          reject(error)
        }
      }
      if (isCsv) {
        const fileContentsWithCarriageReturnRemoved = fileContents.replace(
          '\r',
          '',
        )
        const headers = fileContentsWithCarriageReturnRemoved
          ?.slice(0, fileContentsWithCarriageReturnRemoved?.indexOf('\n'))
          .split(',')

        if (
          !(headers.includes('id') || headers.includes('ID')) ||
          !(headers.includes('latitude') || headers.includes('LATITUDE')) ||
          !(headers.includes('longitude') || headers.includes('LONGITUDE'))
        ) {
          reject("CSV file must contain 'id','latitude', and 'longitude'")
        }

        const latfield = headers.includes('latitude') ? 'latitude' : 'LATITUDE'
        const lonfield = headers.includes('longitude')
          ? 'longitude'
          : 'LONGITUDE'

        getGeojsonFromCsv(
          fileContentsWithCarriageReturnRemoved,
          {
            latfield,
            lonfield,
            delimiter: ',',
          },
          function (error: Error | null, data: FeatureCollection | null) {
            if (!data || error) {
              reject(error)
            }
            resolve(
              copyUppercaseIdToLowercaseId(
                data as FeatureCollection<Point, GeoJsonProperties>,
              ) as UserAssets,
            )
          },
        )
      }

      reject('Unsupported file type')
    }

    fileReader.readAsText(uploadedFile)
  })
}

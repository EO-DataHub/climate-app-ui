// @ts-expect-error - no types available
import { csv2geojson as getGeojsonFromCsv } from 'csv2geojson'
import { FeatureCollection } from 'geojson'

import { getIsFileCsv, getIsFileGeoJson } from '../fileTypes'
import { UserAssets } from './userAssetTypes'

const getAssetsEnsuringIdsExist = (assets: UserAssets) => {
  if (!assets) throw new Error('No assets found')
  const assetFeaturesWithIds = assets.features.map((feature, index) => {
    if (feature.properties.id) return feature
    return {
      ...feature,
      properties: {
        ...feature.properties,
        id: index,
      },
    }
  })
  return { ...assets, features: assetFeaturesWithIds } as UserAssets
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
          const newUserAssets = getAssetsEnsuringIdsExist(
            JSON.parse(fileContents),
          )
          resolve(newUserAssets)
        } catch (error) {
          reject(error)
        }
      }
      if (isCsv) {
        const headers = fileContents
          ?.slice(0, fileContents?.indexOf('\n'))
          .split(',')

        if (!headers.includes('latitude') || !headers.includes('longitude')) {
          reject(
            "CSV file must contain 'latitude' and 'longitude' columns with coordinate information",
          )
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
            resolve(getAssetsEnsuringIdsExist(data as UserAssets))
          },
        )
      }

      reject('Unsupported file type')
    }

    fileReader.readAsText(uploadedFile)
  })
}

// @ts-expect-error - no types available
import { csv2geojson as getGeojsonFromCsv } from 'csv2geojson'
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { useEffect, useState } from 'react'
import { ReactNode, createContext } from 'react'
import {
  bbox as getBbox,
  featureCollection as getFeatureCollection,
  // @ts-expect-error - no types available
} from '@turf/turf'
import { getIsFileCsv, getIsFileGeoJson } from '../services/fileTypes'

type UserAssets = FeatureCollection<Geometry, GeoJsonProperties> | null

export type ParseAssetsIntoGeoJson = (uploadedFile: File) => Promise<UserAssets>

interface UserAssetsContextValue {
  userAssets?: FeatureCollection | null
  parseAssetsIntoGeoJson?: ParseAssetsIntoGeoJson
  setUserAssets?: React.Dispatch<React.SetStateAction<UserAssets>>
}

export const UserAssetsContext = createContext<UserAssetsContextValue>({})

export const UserAssetsProvider = ({ children }: { children: ReactNode }) => {
  const [userAssets, setUserAssets] = useState<FeatureCollection | null>(null)

  const getPyStacItemCollectionFromFeatureCollection = (
    // https://pystac.readthedocs.io/en/stable/api/pystac.html#pystac.ItemCollection
    // Note: its easy to confuse a PyStac Item Collection with a Stac Collection. They are different.
    featureCollection: FeatureCollection,
  ) => {
    const stacFeatures = featureCollection.features.map((feature) => ({
      ...feature,
      stac_version: '1.0.0',
      bbox: getBbox(feature),
      links: [],
      assets: {},
    }))

    return getFeatureCollection(stacFeatures) as FeatureCollection
  }

  const parseAssetsIntoGeoJson = (uploadedFile: File) => {
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
            const newUserAssets = JSON.parse(fileContents)
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
              resolve(data)
            },
          )
        }

        reject('Unsupported file type')
      }

      fileReader.readAsText(uploadedFile)
    })
  }

  useEffect(
    function doSomethingWithNewUserAssets() {
      if (!userAssets) return
      // eslint-disable-next-line no-console
      console.log(
        'PySTAC ItemCollection of assets:',
        getPyStacItemCollectionFromFeatureCollection(userAssets),
      )
    },
    [userAssets],
  )

  return (
    <UserAssetsContext.Provider
      value={{ userAssets, parseAssetsIntoGeoJson, setUserAssets }}
    >
      {children}
    </UserAssetsContext.Provider>
  )
}

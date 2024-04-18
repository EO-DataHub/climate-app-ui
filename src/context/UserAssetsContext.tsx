// @ts-expect-error - no types available
import { csv2geojson as getGeojsonFromCsv } from 'csv2geojson'
import { FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'
import { ReactNode, createContext } from 'react'
import {
  bbox as getBbox,
  featureCollection as getFeatureCollection,
} from '@turf/turf'

enum UploadFileType {
  GEOJSON = 'application/geo+json',
  CSV = 'text/csv',
}
export type LoadUserAssets = (
  event: React.ChangeEvent<HTMLInputElement>,
) => void

interface UserAssetsContextValue {
  userAssets?: FeatureCollection
  loadUserAssets?: LoadUserAssets
}

export const UserAssetsContext = createContext<UserAssetsContextValue>({})

export const UserAssetsProvider = ({ children }: { children: ReactNode }) => {
  const [userAssets, setUserAssets] = useState<FeatureCollection | undefined>()

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

  const loadUserAssets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files ?? []
    const uploadedFile = uploadedFiles[0]
    const isCsv = uploadedFile.type === UploadFileType.CSV.toString()
    const isGeoJson = uploadedFile.type === UploadFileType.GEOJSON.toString()
    const fileReader = new FileReader()

    fileReader.onload = function () {
      const fileContents = fileReader.result
      if (typeof fileContents !== 'string' || !fileContents)
        throw new Error('Error feading file contents')

      if (isGeoJson) {
        setUserAssets(JSON.parse(fileContents) as FeatureCollection)
      }
      if (isCsv) {
        const headers = fileContents
          ?.slice(0, fileContents?.indexOf('\n'))
          .split(',')

        if (!headers.includes('latitude') || !headers.includes('longitude')) {
          throw new Error(
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
              throw new Error(
                'Unable to convert CSV to the format required for asset risk calculations',
              )
            }
            setUserAssets(data)
          },
        )
      }
    }

    fileReader.readAsText(uploadedFile)
  }

  useEffect(
    function doSomethingWithNewUserAssets() {
      if (!userAssets) return
      console.log(
        'PySTAC ItemCollection of assets:',
        getPyStacItemCollectionFromFeatureCollection(userAssets),
      )
    },
    [userAssets],
  )

  return (
    <UserAssetsContext.Provider value={{ userAssets, loadUserAssets }}>
      {children}
    </UserAssetsContext.Provider>
  )
}

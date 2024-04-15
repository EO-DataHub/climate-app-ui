// @ts-expect-error - no types available
import { csv2geojson as getGeojsonFromCsv } from 'csv2geojson'
import { FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'
import { LngLatBoundsLike, Map as MaplibreMap } from 'maplibre-gl'
// @ts-expect-error - no types available
import { bbox as turfBbox } from '@turf/turf'

enum UploadFileType {
  GEOJSON = 'application/geo+json',
  CSV = 'text/csv',
}
export type LoadUserAssets = (
  event: React.ChangeEvent<HTMLInputElement>,
) => void

export const useUploadedAssets = ({
  mapInstance,
}: {
  mapInstance: MaplibreMap | undefined
}) => {
  const [userAssets, setUserAssets] = useState<FeatureCollection | undefined>()

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
    function updateUserAssets() {
      if (!mapInstance || !userAssets) return

      const userAssetBounds = turfBbox(userAssets) as LngLatBoundsLike
      const userAssetsSource = mapInstance.getSource(
        'userAssets',
      ) as maplibregl.GeoJSONSource

      const userAssetsLayer = mapInstance.getLayer('userAssets')

      if (userAssetsSource) {
        userAssetsSource.setData(userAssets)
      }

      if (!userAssetsSource) {
        mapInstance.addSource('userAssets', {
          type: 'geojson',
          data: userAssets,
        })
      }

      if (!userAssetsLayer) {
        mapInstance.addLayer({
          id: 'userAssets',
          type: 'circle',
          source: 'userAssets',
          paint: {
            'circle-color': '#FF0000',
            'circle-radius': 5,
          },
        })
      }

      mapInstance.fitBounds(userAssetBounds)
    },
    [mapInstance, userAssets],
  )

  return { userAssets, loadUserAssets }
}

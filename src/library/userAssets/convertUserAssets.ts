import { UserAssets } from '../../context/UserAssetsContext'

export interface UserAssetForTable {
  assetType: string
  latitude: number
  longitude: number
  country?: string
  vulnerability?: string
  [x: string]: unknown
}

export const convertGeoJSONToDataForTable = (
  userAssets?: UserAssets,
): UserAssetForTable[] => {
  if (!userAssets) return []

  return userAssets.features.map((feature) => ({
    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
    ...feature.properties,
  }))
}

export const convertDataForTableToGeoJSON = (
  tableAssets: UserAssetForTable[],
): UserAssets => {
  return {
    type: 'FeatureCollection',
    features: tableAssets.map((tableAsset) => {
      const { latitude, longitude, ...properties } = tableAsset
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        properties: properties,
      }
    }),
  }
}

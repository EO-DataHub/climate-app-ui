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

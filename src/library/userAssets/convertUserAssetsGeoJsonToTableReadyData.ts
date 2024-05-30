import { UserAssets } from '../../context/UserAssetsContext'

export interface UserAssetsForTable {
  assetType: string
  latitude: number
  longitude: number
  country?: string
  vulnerability?: string
}

export const convertGeoJSONToDataForTable = (
  userAssets?: UserAssets,
): UserAssetsForTable[] => {
  if (!userAssets) return []

  return userAssets.features.map((feature) => ({
    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
    assetType: feature.properties.assetType,
    country: feature.properties.country,
    vulnerability: feature.properties.vulnerability,
  }))
}

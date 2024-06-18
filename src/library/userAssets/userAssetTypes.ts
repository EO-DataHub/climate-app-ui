import { FeatureCollection, Point } from 'geojson'

export type RowSelection = Record<string | number, boolean>
interface UserAssetsProperties {
  id: string | number
  assetType: string
  country?: string
  vulnerability?: string
}

export type UserAssets = FeatureCollection<Point, UserAssetsProperties> | null

export type parseUploadedAssetsIntoGeoJson = (
  uploadedFile: File,
) => Promise<UserAssets>

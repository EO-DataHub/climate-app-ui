import { FeatureCollection, Point } from 'geojson'

export type RowSelection = Record<string | number, boolean>
export interface UserAssetsProperties {
  id: string | number
  type: string
  location: string
  asset_class: string
  [x: string]: unknown
}

export type UserAssets = FeatureCollection<Point, UserAssetsProperties> | null
export type AnalysedUserAssets = FeatureCollection<
  Point,
  UserAssetsProperties // for now the API returns invalid GeoJson (attributes outside of the properties object), so this type is a bit of a lie
> | null

export type parseUploadedAssetsIntoGeoJson = (
  uploadedFile: File,
) => Promise<UserAssets>

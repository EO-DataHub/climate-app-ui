import { FeatureCollection } from 'geojson'
import { getUniquePropertyKeysFromFeatureCollection } from '../geoJson/getUniquePropertyKeysFromFeatureCollection'

/**
 * Basic columns that are already validated during file upload
 */
const BASIC_COLUMNS = ['id', 'latitude', 'longitude']

/**
 * Validates if uploaded assets contain the required columns specified in workflow options,
 * excluding basic columns (id, latitude, longitude) that are already validated during file upload.
 *
 * @param userAssets - The uploaded assets as a FeatureCollection
 * @param requiredColumns - Array of required column names from workflow options
 * @returns Object containing validation result and missing columns
 */
export const validateRequiredColumns = (
  userAssets: FeatureCollection,
  requiredColumns: string[],
): {
  isValid: boolean
  missingColumns: string[]
} => {
  // Get all unique property keys from the assets (case-insensitive)
  const assetPropertyKeys =
    getUniquePropertyKeysFromFeatureCollection(userAssets)

  // Filter out basic columns that are already validated during upload
  const nonBasicRequiredColumns = requiredColumns.filter(
    (column) => !BASIC_COLUMNS.includes(column.toLowerCase()),
  )

  // Check which required columns are missing
  const missingColumns = nonBasicRequiredColumns.filter(
    (column) => !assetPropertyKeys.has(column.toLowerCase()),
  )

  return {
    isValid: missingColumns.length === 0,
    missingColumns,
  }
}

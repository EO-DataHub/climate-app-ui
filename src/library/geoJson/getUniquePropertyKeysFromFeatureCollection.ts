import { FeatureCollection } from 'geojson'

/**
 * Extracts all unique property keys from a FeatureCollection in a case-insensitive manner.
 * Iterates through all features and collects property keys from feature.properties,
 * converting them to lowercase and storing them in a Set to ensure uniqueness.
 *
 * @param featureCollection - The FeatureCollection to extract property keys from
 * @returns A Set of lowercase property keys
 */
export const getUniquePropertyKeysFromFeatureCollection = (
  featureCollection: FeatureCollection,
): Set<string> => {
  const uniqueKeys = new Set<string>()

  featureCollection.features.forEach((feature) => {
    if (feature.properties) {
      Object.keys(feature.properties).forEach((key) => {
        uniqueKeys.add(key.toLowerCase())
      })
    }
  })

  return uniqueKeys
}

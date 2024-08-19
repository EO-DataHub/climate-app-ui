import { Feature, Point } from 'geojson'
import { UserAssets, UserAssetsProperties } from './userAssetTypes'

export interface UserAssetForTable extends UserAssetsProperties {
  latitude: number
  longitude: number
}

export interface AnalysedOscUserAssetForTable extends UserAssetForTable {
  year?: string
  scenario?: string
  hazardType?: string
}

export const convertSimpleGeoJSONToDataForTable = (
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
        properties,
      }
    }),
  }
}

export const flattenOscRootFeatureProperty = ({
  feature,
  rootLevelPropertyName,
}: {
  feature: Feature<Point, UserAssetsProperties>
  rootLevelPropertyName: string
}) => {
  // @ts-expect-error - results schema subject to change. Skipping typing for now.
  const rootLevelFeatureProperty = feature[rootLevelPropertyName]
  const [longitude, latitude] = feature.geometry.coordinates
  const { id } = feature.properties
  const hazardTypes = Object.keys(rootLevelFeatureProperty)
  return hazardTypes
    .map((hazardType) => {
      const scenarioLevelinformation = rootLevelFeatureProperty[hazardType]

      const scenarioNames = Object.keys(scenarioLevelinformation)

      return scenarioNames
        .map((scenario) => {
          const yearLevelInformation = scenarioLevelinformation[scenario]
          const yearNames = Object.keys(yearLevelInformation)
          const indicatorInformationWithYearAndScenario = yearNames.map(
            (year) => {
              const {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                impact_distribution,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                impact_exceedance,
                ...restOfProperties
              } = yearLevelInformation[year] as Record<string, number>
              return {
                id,
                latitude,
                longitude,
                year,
                scenario,
                hazardType,
                ...restOfProperties,
              }
            },
          )

          return indicatorInformationWithYearAndScenario
        })
        .flat()
    })
    .flat()
}

export const getOscResultsTableData = (
  analysedUserAssets: UserAssets | undefined,
) => {
  if (!analysedUserAssets) return []

  const featuresWithFlattenedRiskMeasures = analysedUserAssets.features
    .map((feature) => {
      return flattenOscRootFeatureProperty({
        feature,
        rootLevelPropertyName: 'asset_impacts',
      })
    })
    .flat()

  return featuresWithFlattenedRiskMeasures as unknown as AnalysedOscUserAssetForTable[]
}

export const getLstResultsTableData = (
  analysedUserAssets: UserAssets | undefined,
) => {
  if (!analysedUserAssets) return []

  return analysedUserAssets.features.map((feature) => {
    const [longitude, latitude] = feature.geometry.coordinates
    const { returned_values, ...restOfProperties } = feature.properties

    return {
      latitude,
      longitude,
      ...restOfProperties,
      ...(returned_values as object),
    }
  })
}

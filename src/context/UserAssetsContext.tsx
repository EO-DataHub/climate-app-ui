import { FeatureCollection } from 'geojson'
import { useEffect, useState } from 'react'
import { ReactNode, createContext } from 'react'
import {
  bbox as getBbox,
  featureCollection as getFeatureCollection,
  // @ts-expect-error - no types available
} from '@turf/turf'
import {
  AnalysedUserAssets,
  UserAssets,
} from '../library/userAssets/userAssetTypes'

interface UserAssetsContextValue {
  userAssets?: UserAssets
  setUserAssets?: React.Dispatch<React.SetStateAction<UserAssets>>
  analysedUserAssets?: AnalysedUserAssets
  setAnalysedUserAssets?: React.Dispatch<
    React.SetStateAction<AnalysedUserAssets>
  >
}

export const UserAssetsContext = createContext<UserAssetsContextValue>({})

export const UserAssetsProvider = ({ children }: { children: ReactNode }) => {
  const [userAssets, setUserAssets] = useState<UserAssets>(null)
  const [analysedUserAssets, setAnalysedUserAssets] =
    useState<AnalysedUserAssets>(null)

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

  useEffect(
    function doSomethingWithNewUserAssets() {
      if (!userAssets) return
      // eslint-disable-next-line no-console
      console.log(
        'PySTAC ItemCollection of assets:',
        getPyStacItemCollectionFromFeatureCollection(userAssets),
      )
    },
    [userAssets],
  )

  return (
    <UserAssetsContext.Provider
      value={{
        userAssets,
        setUserAssets,
        analysedUserAssets,
        setAnalysedUserAssets,
      }}
    >
      {children}
    </UserAssetsContext.Provider>
  )
}

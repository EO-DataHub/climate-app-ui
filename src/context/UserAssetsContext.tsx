import { useState } from 'react'
import { ReactNode, createContext } from 'react'

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

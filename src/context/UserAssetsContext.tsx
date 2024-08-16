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
  uploadedFileName?: string | null
  setUploadedFileName?: React.Dispatch<React.SetStateAction<string | null>>
  currentWorkflowNickname?: string | undefined
  setCurrentWorkflowNickname?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
}

export const UserAssetsContext = createContext<UserAssetsContextValue>({})

export const UserAssetsProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [userAssets, setUserAssets] = useState<UserAssets>(null)
  const [analysedUserAssets, setAnalysedUserAssets] =
    useState<AnalysedUserAssets>(null)
  const [currentWorkflowNickname, setCurrentWorkflowNickname] = useState<
    string | undefined
  >()

  return (
    <UserAssetsContext.Provider
      value={{
        userAssets,
        setUserAssets,
        analysedUserAssets,
        setAnalysedUserAssets,
        uploadedFileName,
        setUploadedFileName,
        currentWorkflowNickname,
        setCurrentWorkflowNickname,
      }}
    >
      {children}
    </UserAssetsContext.Provider>
  )
}

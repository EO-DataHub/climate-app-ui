import { useState, Dispatch, SetStateAction } from 'react'
import { ReactNode, createContext } from 'react'

import {
  AnalysedUserAssets,
  UserAssets,
} from '../library/userAssets/userAssetTypes'

interface UserAssetsContextValue {
  analysedUserAssets?: AnalysedUserAssets
  analysisRunDate?: string
  currentWorkflowNickname?: string | undefined
  setAnalysedUserAssets?: Dispatch<SetStateAction<AnalysedUserAssets>>
  setAnalysisRunDate?: Dispatch<SetStateAction<string | undefined>>
  setCurrentWorkflowNickname?: Dispatch<SetStateAction<string | undefined>>
  setUploadedFileName?: Dispatch<SetStateAction<string | null>>
  setUserAssets?: Dispatch<SetStateAction<UserAssets>>
  uploadedFileName?: string | null
  userAssets?: UserAssets
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
  const [analysisRunDate, setAnalysisRunDate] = useState<string>()

  return (
    <UserAssetsContext.Provider
      value={{
        analysedUserAssets,
        analysisRunDate,
        currentWorkflowNickname,
        setAnalysedUserAssets,
        setAnalysisRunDate,
        setCurrentWorkflowNickname,
        setUploadedFileName,
        setUserAssets,
        uploadedFileName,
        userAssets,
      }}
    >
      {children}
    </UserAssetsContext.Provider>
  )
}

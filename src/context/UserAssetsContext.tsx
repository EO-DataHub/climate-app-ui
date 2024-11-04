import {
  useState,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from 'react'
import { ReactNode, createContext } from 'react'

import {
  AnalysedUserAssets,
  UserAssets,
} from '../library/userAssets/userAssetTypes'
import { AuthenticationContext } from './AuthenticationContext'
import { getCsvResultsUrl } from '../library/api/getUrls'
import { HubWorkflowNicknames } from '../configuration/constants'

interface UserAssetsContextValue {
  analysedUserAssets?: AnalysedUserAssets
  analysisRunDate?: string
  csvResults?: string | null
  currentWorkflowNickname?: string | undefined
  setAnalysedUserAssets?: Dispatch<SetStateAction<AnalysedUserAssets>>
  setAnalysisRunDate?: Dispatch<SetStateAction<string | undefined>>
  setCurrentWorkflowNickname?: Dispatch<SetStateAction<string | undefined>>
  setUploadedFileName?: Dispatch<SetStateAction<string | null>>
  setUserAssets?: Dispatch<SetStateAction<UserAssets>>
  setWorkflowJobIdAssociatedWithData?: Dispatch<SetStateAction<string | null>>
  uploadedFileName?: string | null
  userAssets?: UserAssets
  workflowJobIdAssociatedWithData?: string | null
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
  const [workflowJobIdAssociatedWithData, setWorkflowJobIdAssociatedWithData] =
    useState<string | null>(null)

  const [csvResults, setCsvResults] = useState<string | null>(null)

  const { workspaceUserName, authenticatedAxios } = useContext(
    AuthenticationContext,
  )

  useEffect(
    function getCsvResults() {
      if (
        !authenticatedAxios ||
        !workflowJobIdAssociatedWithData ||
        !workspaceUserName ||
        currentWorkflowNickname === HubWorkflowNicknames.OSC
      )
        return

      setCsvResults(null)

      void authenticatedAxios
        .get(
          getCsvResultsUrl({
            workspaceUserName,
            jobId: workflowJobIdAssociatedWithData,
          }),
        )
        .then((response) => {
          setCsvResults(response.data)
        })
    },
    [
      authenticatedAxios,
      currentWorkflowNickname,
      workflowJobIdAssociatedWithData,
      workspaceUserName,
    ],
  )

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
        setWorkflowJobIdAssociatedWithData,
        uploadedFileName,
        userAssets,
        workflowJobIdAssociatedWithData,
        csvResults,
      }}
    >
      {children}
    </UserAssetsContext.Provider>
  )
}

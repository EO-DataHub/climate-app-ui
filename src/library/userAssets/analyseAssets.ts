import { AxiosInstance } from 'axios'

import { AnalysedUserAssets } from './userAssetTypes'
import {
  HubWorkflowNicknamesType,
  hubWorkflowNames,
} from '../../configuration/constants'
import { getResultsUrl } from '../api/getUrls'
import { getRelativeS3PathForAssetFile } from '../api/getHubAssetStorageUrls'

const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL

const initiateAssetsRiskAnalysis = async ({
  axios,
  currentWorkflowNickname,
  fileName,
  workspaceUserName,
}: {
  axios: AxiosInstance
  currentWorkflowNickname: HubWorkflowNicknamesType
  fileName: string
  workspaceUserName: string
}) => {
  return axios.post(
    `${HUB_BASE_URL}/ades/${workspaceUserName}/ogc-api/processes/${hubWorkflowNames[currentWorkflowNickname]}/execution`,
    {
      inputs: {
        workspace: workspaceUserName,
        json_file: getRelativeS3PathForAssetFile({
          workspaceUserName,
          fileName,
        }),
      },
    },
    {
      headers: { prefer: 'respond-async' },
    },
  )
}

const getIsDataReady = (status: string) => {
  if (status === 'running') {
    return false
  } else if (status === 'successful') {
    return true
  } else {
    throw new Error('Failed to get status')
  }
}

const getData = async ({
  axios,
  jobId,
  workspaceUserName,
}: {
  axios: AxiosInstance
  jobId: string
  workspaceUserName: string
}) => {
  const resultsUrl = getResultsUrl({ jobId, workspaceUserName })
  return axios.get(resultsUrl).then((response) => {
    return response.data.data as AnalysedUserAssets
  })
}

async function getAssetsRiskResults({
  axios,
  url,
  workspaceUserName,
}: {
  axios: AxiosInstance
  url: string
  workspaceUserName: string
}) {
  const pollForAnalysisResults = async (
    resolve: (result: {
      analysedData: AnalysedUserAssets
      jobId: string
    }) => void,
    reject: (error: unknown) => void,
  ) => {
    try {
      const {
        data: { status, jobID: jobId },
      } = await axios.get(url)
      const isDataReady = getIsDataReady(status)
      if (isDataReady) {
        const data = await getData({
          axios,
          jobId,
          workspaceUserName,
        })

        resolve({ analysedData: data, jobId })
      } else {
        setTimeout(() => {
          void pollForAnalysisResults(resolve, reject)
        }, 10000)
      }
    } catch (error) {
      reject(error)
    }
  }

  return new Promise(pollForAnalysisResults)
}

export const analyseAssets = ({
  axios,
  currentWorkflowNickname,
  fileName,
  workspaceUserName,
}: {
  axios?: AxiosInstance
  currentWorkflowNickname: HubWorkflowNicknamesType
  fileName: string
  workspaceUserName: string
}) => {
  if (!axios) {
    throw new Error('axios is required')
  }
  if (!workspaceUserName) {
    throw new Error('The user must be logged in and have a username')
  }

  return initiateAssetsRiskAnalysis({
    axios,
    currentWorkflowNickname,
    fileName,
    workspaceUserName,
  }).then((response) => {
    const statusPollingUrl = response.data.links.find(
      (link: { title: string }) => link.title === 'Status location',
    ).href

    return getAssetsRiskResults({
      axios,
      url: statusPollingUrl,
      workspaceUserName,
    })
  })
}

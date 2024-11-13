import { AxiosError, AxiosInstance } from 'axios'

import { AnalysedUserAssets } from './userAssetTypes'
import { getRelativeS3PathForAssetFile } from '../api/getHubAssetStorageUrls'
import { getResultsUrl } from '../api/getUrls'
import { HubWorkflowPresetInputs } from '../api/apiTypes'

const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL

const initiateAssetsRiskAnalysis = async ({
  axios,
  endDate,
  fileName,
  hubWorkflowPresetInputs,
  startDate,
  workspaceUserName,
}: {
  axios: AxiosInstance
  endDate?: string
  fileName: string
  hubWorkflowPresetInputs: HubWorkflowPresetInputs | undefined
  startDate?: string
  workspaceUserName: string
}) => {
  const inputsFromConfigurationsToUse = {
    stac_collection: hubWorkflowPresetInputs?.stac_collection,
    'day/night': hubWorkflowPresetInputs?.['day/night'],
  }
  return axios.post(
    `${HUB_BASE_URL}/ades/${workspaceUserName}/ogc-api/processes/${hubWorkflowPresetInputs?.workflow}/execution`,
    {
      ...inputsFromConfigurationsToUse,
      assets: getRelativeS3PathForAssetFile({
        workspaceUserName,
        fileName,
      }),
      start_date: startDate,
      end_date: endDate,
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
      if (
        error instanceof AxiosError &&
        error.response?.data.title === 'NoSuchJob'
      ) {
        return // analysis was  deleted/cancelled
      }
      reject(error)
    }
  }

  return new Promise(pollForAnalysisResults)
}

export const analyseAssets = ({
  axios,
  endDate,
  fileName,
  startDate,
  hubWorkflowPresetInputs,
  workspaceUserName,
}: {
  axios?: AxiosInstance
  endDate?: string
  fileName: string

  startDate?: string
  hubWorkflowPresetInputs: HubWorkflowPresetInputs | undefined
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
    endDate,
    fileName,
    startDate,
    workspaceUserName,
    hubWorkflowPresetInputs,
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

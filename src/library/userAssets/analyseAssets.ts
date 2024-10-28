import { AxiosInstance } from 'axios'

import { AnalysedUserAssets, UserAssets } from './userAssetTypes'
import {
  HubWorkflowNicknamesType,
  workflowHubNames,
} from '../../configuration/constants'

const initiateAssetsRiskAnalysis = async ({
  axios,
  currentWorkflowNickname,
  userAssets,
  workspaceUserName,
}: {
  axios: AxiosInstance
  currentWorkflowNickname: HubWorkflowNicknamesType
  userAssets: UserAssets
  workspaceUserName: string
}) => {
  return axios.post(
    `https://test.eodatahub.org.uk/ades/${workspaceUserName}/ogc-api/processes/${workflowHubNames[currentWorkflowNickname]}/execution`,
    {
      inputs: {
        workspace: workspaceUserName,
        json_string: JSON.stringify(userAssets),
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
  const resultsUrl = `https://${workspaceUserName}.workspaces.test.eodhp.eco-ke-staging.com/files/eodhp-test-workspaces1/processing-results/cat_${jobId}.json`
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
    resolve: (data: AnalysedUserAssets) => void,
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
        resolve(data)
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
  userAssets,
  workspaceUserName,
}: {
  axios?: AxiosInstance
  currentWorkflowNickname: HubWorkflowNicknamesType
  userAssets: UserAssets
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
    userAssets,
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

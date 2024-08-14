import { AxiosInstance } from 'axios'

import { KeycloakUserInfo } from '../../context/AuthenticationContext'
import { AnalysedUserAssets, UserAssets } from './userAssetTypes'

const initiateAssetsRiskAnalysis = async ({
  axios,
  userAssets,
  workspaceUserName,
}: {
  axios: AxiosInstance
  userAssets: UserAssets
  workspaceUserName: string
}) => {
  return axios.post(
    `https://test.eodatahub.org.uk/ades/${workspaceUserName}/ogc-api/processes/get-asset-impact-workflow/execution`,
    {
      inputs: {
        workspace: workspaceUserName,
        json_string: JSON.stringify(userAssets),
      },
    },
    {
      headers: {},
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
    return response.data as AnalysedUserAssets
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
  userAssets,
  userInfo,
}: {
  axios?: AxiosInstance
  userAssets: UserAssets
  userInfo: KeycloakUserInfo
}) => {
  const workspaceUserName = userInfo.preferred_username?.replace('-', '_')

  if (!axios) {
    throw new Error('axios is required')
  }
  if (!workspaceUserName) {
    throw new Error('The user must be logged in and have a username')
  }

  return initiateAssetsRiskAnalysis({
    userAssets,
    axios,
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

import { AxiosInstance } from 'axios'

import { AnalysedUserAssets, UserAssets } from './userAssetTypes'

const initiateAssetsRiskAnalysis = async ({
  userAssets,
  axios,
}: {
  userAssets: UserAssets
  axios: AxiosInstance
}) => {
  return axios.post(
    'https://test.eodatahub.org.uk/ades/eric/ogc-api/processes/get-asset-impact-workflow/execution',
    {
      inputs: {
        workspace: 'ddowding',
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
  analysisResultsBearerToken,
  axios,
  jobId,
}: {
  analysisResultsBearerToken: string
  axios: AxiosInstance
  jobId: string
}) => {
  const resultsUrl = `https://ddowding.workspaces.test.eodhp.eco-ke-staging.com/files/eodhp-test-workspaces1/processing-results/cat_${jobId}.json`
  return axios
    .get(resultsUrl, {
      headers: {
        Authorization: `Bearer ${analysisResultsBearerToken}`,
      },
    })
    .then((response) => {
      return response.data as AnalysedUserAssets
    })
}

async function getAssetsRiskResults({
  analysisResultsBearerToken,
  axios,
  url,
}: {
  analysisResultsBearerToken: string
  axios: AxiosInstance
  url: string
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
        const data = await getData({ jobId, analysisResultsBearerToken, axios })
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
  analysisResultsBearerToken,
  axios,
  userAssets,
}: {
  analysisResultsBearerToken: string
  axios?: AxiosInstance
  userAssets: UserAssets
}) => {
  if (!axios) {
    throw new Error('axios is required')
  }

  return initiateAssetsRiskAnalysis({ userAssets, axios }).then((response) => {
    const statusPollingUrl = response.data.links.find(
      (link: { title: string }) => link.title === 'Status location',
    ).href

    return getAssetsRiskResults({
      analysisResultsBearerToken,
      axios,
      url: statusPollingUrl,
    })
  })
}

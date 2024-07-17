import axios from 'axios'

import { AnalysedUserAssets, UserAssets } from './userAssetTypes'

const RISK_ANALYSIS_WORKFLOW_INSTRUCTIONS = {
  properties: {
    include_asset_level: true,
    include_calc_details: true,
    include_measures: true,
    years: [2030, 2040, 2050],
    scenarios: ['ssp126', 'ssp245', 'ssp585'],
  }, // ideally we send this via request parameters, but the current API needs it appended to the geojson asset data and we have tight timelines'
}

Object.freeze(RISK_ANALYSIS_WORKFLOW_INSTRUCTIONS)

const initiateAssetsRiskAnalysis = async (userAssets: UserAssets) => {
  const userAssetsWithAnalysisInstructions = {
    ...userAssets,
    ...RISK_ANALYSIS_WORKFLOW_INSTRUCTIONS,
  }

  return axios.post(
    'https://test.eodatahub.org.uk/ades/eric/ogc-api/processes/get-asset-impact-workflow-batch/execution',
    {
      inputs: {
        workspace: 'ddowding',
        json_string: JSON.stringify(userAssetsWithAnalysisInstructions),
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
  jobId,
  analysisResultsBearerToken,
}: {
  jobId: string
  analysisResultsBearerToken: string
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
  url,

  analysisResultsBearerToken,
}: {
  url: string

  analysisResultsBearerToken: string
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
        const data = await getData({ jobId, analysisResultsBearerToken })
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
  userAssets,
}: {
  analysisResultsBearerToken: string
  userAssets: UserAssets
}) => {
  return initiateAssetsRiskAnalysis(userAssets).then((response) => {
    const statusPollingUrl = response.data.links.find(
      (link: { title: string }) => link.title === 'Status location',
    ).href

    return getAssetsRiskResults({
      url: statusPollingUrl,
      analysisResultsBearerToken,
    })
  })
}

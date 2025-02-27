const AWS_BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME
const HUB_ENV = import.meta.env.VITE_HUB_ENV

import { AxiosInstance } from 'axios'

interface JobResponse {
  processID: string
}

export const getProcessId = async ({
  workspaceUserName,
  jobId,
  authenticatedAxios,
}: {
  jobId: string
  workspaceUserName: string
  authenticatedAxios: AxiosInstance
}) => {
  const url = `https://${HUB_ENV}.eodatahub.org.uk/ades/${workspaceUserName}/ogc-api/jobs/${jobId}`
  const response = await authenticatedAxios.get<JobResponse>(url)
  return response.data.processID
}

export const getResultsUrl = ({
  workspaceUserName,
  jobId,
  process_id,
}: {
  jobId: string
  workspaceUserName: string
  process_id: string
}) => {
  return `https://${workspaceUserName}.${HUB_ENV}.eodatahub-workspaces.org.uk/files/workspaces-eodhp-${HUB_ENV}/processing-results/${process_id}/cat_${jobId}.json`
}

export const getCsvResultsUrl = ({
  workspaceUserName,
  jobId,
}: {
  jobId: string
  workspaceUserName: string
  process_id: string
}) =>
  `https://${workspaceUserName}.${HUB_ENV}.eodatahub-workspaces.org.uk/files/workspaces-eodhp-${HUB_ENV}/processing-results/cat_${jobId}/col_${jobId}/data.csv`

export const getUploadedFileUrl = ({
  workspaceUserName,
  fileName,
}: {
  workspaceUserName: string
  fileName: string
}) =>
  `https://${workspaceUserName}.workspaces.staging.eodhp.eco-ke-staging.com/files/${AWS_BUCKET_NAME}/user-assets/${fileName}`

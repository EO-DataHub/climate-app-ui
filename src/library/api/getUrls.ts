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
  return `https://${workspaceUserName}.${HUB_ENV}.eodatahub-workspaces.org.uk/files/${AWS_BUCKET_NAME}/processing-results/${process_id}/cat_${jobId}.json`
}

export const getCsvResultsUrl = ({
  workspaceUserName,
  jobId,
}: {
  workspaceUserName: string
  jobId: string
}) =>
  `https://${workspaceUserName}.${HUB_ENV}.eodatahub-workspaces.org.uk/files/${AWS_BUCKET_NAME}/processing-results/lst-filter/cat_${jobId}/col_${jobId}/data.csv`

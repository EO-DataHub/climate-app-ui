const AWS_BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME
const HUB_APP_WORKSPACE_NAME = import.meta.env.VITE_HUB_APP_WORKSPACE_NAME
const HUB_BASE_URL = import.meta.env.VITE_WORKFLOW_BASE_URL

import { AxiosInstance } from 'axios'

interface JobResponse {
  processID: string
}

export const getProcessId = async ({
  jobId,
  authenticatedAxios,
}: {
  jobId: string
  authenticatedAxios: AxiosInstance
}) => {
  const url = `${HUB_BASE_URL}/ades/${HUB_APP_WORKSPACE_NAME}/ogc-api/jobs/${jobId}`
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
  return `https://${workspaceUserName}.eodatahub-workspaces.org.uk/files/${AWS_BUCKET_NAME}/processing-results/${process_id}/cat_${jobId}.json`
}

export const getCsvResultsUrl = ({
  workspaceUserName,
  jobId,
  process_id,
}: {
  workspaceUserName: string
  jobId: string
  process_id: string
}) =>
  `https://${workspaceUserName}.eodatahub-workspaces.org.uk/files/${AWS_BUCKET_NAME}/processing-results/${process_id}/cat_${jobId}/col_${jobId}/data.csv`

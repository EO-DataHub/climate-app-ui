import { AxiosInstance } from 'axios'

export const deleteWorkflow = async ({
  jobId,
  authenticatedAxios,
}: {
  jobId: string
  authenticatedAxios: AxiosInstance
}) => {
  const HUB_BASE_URL = import.meta.env.VITE_WORKFLOW_BASE_URL
  const HUB_APP_WORKSPACE_NAME = import.meta.env.VITE_HUB_APP_WORKSPACE_NAME

  await authenticatedAxios.delete(
    `${HUB_BASE_URL}/ades/${HUB_APP_WORKSPACE_NAME}/ogc-api/jobs/${jobId}`,
  )
}

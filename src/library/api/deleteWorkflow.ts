import { AxiosInstance } from 'axios'

const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL

export const deleteWorkflow = ({
  authenticatedAxios,
  jobId,
  workspaceUserName,
}: {
  authenticatedAxios: AxiosInstance
  jobId: string
  workspaceUserName: string
}) => {
  return authenticatedAxios.delete(
    `${HUB_BASE_URL}/ades/${workspaceUserName}/ogc-api/jobs/${jobId}`,
  )
}

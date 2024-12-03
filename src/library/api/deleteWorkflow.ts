import { AxiosInstance } from 'axios'

const HUB_BASE_URL = import.meta.env.VITE_HUB_BASE_URL

export const deleteWorkflow = ({
  authenticatedAxios,
  jobId,
}: {
  authenticatedAxios: AxiosInstance
  jobId: string
}) => {
  return authenticatedAxios.delete(
    `${HUB_BASE_URL}/ades/sparkgeouser/ogc-api/jobs/${jobId}`,
  )
}

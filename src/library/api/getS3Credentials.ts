import { AxiosInstance } from 'axios'

const HUB_BASE_URL = import.meta.env.VITE_WORKFLOW_BASE_URL

export const getS3Credentials = ({
  authenticatedAxios,
}: {
  authenticatedAxios: AxiosInstance
}) => {
  return authenticatedAxios
    .post(`${HUB_BASE_URL}/api/workspaces/sparkgeouser/me/s3-tokens`)
    .then((response) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data
    })
}

import axios from 'axios'

const authenticatedAxios = axios.create()

export const getAuthenticatedAxios = ({
  token,
  getUpdatedToken,
}: {
  token: string | undefined
  getUpdatedToken: () => Promise<string | undefined>
}) => {
  let tokenExpiredRetries = 0

  if (!token)
    throw new Error(
      'Token is required to create an authenticated axios instance',
    )

  let tokenToUse = token

  authenticatedAxios.interceptors.request.use(
    (config) => {
      if (tokenToUse) {
        tokenExpiredRetries = 0
        config.headers.Authorization = `Bearer ${tokenToUse}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  authenticatedAxios.interceptors.response.use(
    (response) => {
      return response
    },
    async function (error) {
      const originalRequest = error.config
      const errorStatus = error.response?.status
      if (
        (errorStatus === 403 || errorStatus === 401) &&
        tokenExpiredRetries < 3
      ) {
        tokenExpiredRetries = tokenExpiredRetries + 1
        const newAccessToken = await getUpdatedToken()

        if (newAccessToken) {
          tokenToUse = newAccessToken
        }

        return authenticatedAxios(originalRequest)
      }

      return Promise.reject(error)
    },
  )

  return authenticatedAxios
}

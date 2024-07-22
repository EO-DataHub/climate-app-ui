import axios from 'axios'

const authenticatedAxios = axios.create()

export const getAuthenticatedAxios = (token: string | undefined) => {
  if (!token)
    throw new Error(
      'Token is required to create an authenticated axios instance',
    )
  authenticatedAxios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  return authenticatedAxios
}

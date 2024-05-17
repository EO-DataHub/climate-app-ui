import axios from 'axios'
import { AuthenticationService } from './api/authentication'

const authenticatedAxios = axios.create()

const getAuthenticatedAxios = (
  authenticationService: AuthenticationService,
) => {
  authenticatedAxios.interceptors.request.use(
    (config) => {
      const token = authenticationService.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  return authenticatedAxios
}

export default { getAuthenticatedAxios }

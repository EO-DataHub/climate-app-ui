import axios, { AxiosError, AxiosInstance } from 'axios'
class AuthenticatedAxios {
  token: string
  authenticatedAxios: AxiosInstance
  getUpdatedToken: () => Promise<string | undefined>

  constructor(
    token: string,
    getUpdatedToken: () => Promise<string | undefined>,
  ) {
    this.token = token
    this.getUpdatedToken = getUpdatedToken

    this.authenticatedAxios = axios.create({
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })

    this.authenticatedAxios.interceptors.response.use(
      (response) => response,
      this.createErrorInterceptor(),
    )
  }

  updateToken(newToken: string) {
    this.token = newToken
    this.authenticatedAxios = axios.create({
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    })
  }

  createErrorInterceptor() {
    let retries = 0

    return async (error: AxiosError) => {
      const { config } = error
      const status = error.response?.status

      if ((status === 403 || status === 401) && retries < 3) {
        retries = retries + 1

        const newAccessToken = await this.getUpdatedToken()

        if (newAccessToken) {
          retries = 0

          this.updateToken(newAccessToken)

          return this.authenticatedAxios({
            ...config,
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          })
        }
      }

      return Promise.reject(error)
    }
  }
}

export default AuthenticatedAxios

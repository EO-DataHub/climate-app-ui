import { useEffect, useState } from 'react'
import { ReactNode, createContext } from 'react'
import Keycloak, { KeycloakOnLoad } from 'keycloak-js'
import { getAuthenticatedAxios } from '../library/axios'
import { AxiosInstance } from 'axios'

export interface KeycloakUserInfo {
  sub?: string
  email_verified?: boolean
  name?: string
  preferred_username?: string
  given_name?: string
  family_name?: string
  email?: string
}

interface AuthenticationContextValue {
  isAuthenticated: boolean
  isAuthenticating: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  authenticatedAxios?: AxiosInstance
  userInfo?: KeycloakUserInfo
}

const initOptions = {
  url: import.meta.env.VITE_KEYCLOAK_URL as string,
  realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string,
  onLoad: 'check-sso',
}

const authenticationInstance = new Keycloak(initOptions)

const ensureLogoutDoesNotRedirect = () => {
  authenticationInstance.createLogoutUrl = function () {
    return (
      // @ts-expect-error - missing property in type definitions
      authenticationInstance.endpoints.logout() +
      '?id_token_hint=' +
      authenticationInstance.idToken +
      '&post_logout_redirect_uri=' +
      encodeURIComponent(window.location.href)
    )
  }
}

const initializeAuthentication = ({
  setIsAuthenticated,
  setIsAuthenticating,
  setUserInfo,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  setIsAuthenticating: React.Dispatch<React.SetStateAction<boolean>>
  setUserInfo: React.Dispatch<React.SetStateAction<KeycloakUserInfo>>
}) => {
  // @ts-expect-error - didInitialize isnt technically a public property, but ticket accepted to make it so https://github.com/keycloak/keycloak/issues/27040
  if (authenticationInstance.didInitialize) return // this ensures vite HMR keeps working in development

  setIsAuthenticating(true)

  authenticationInstance
    .init({
      onLoad: initOptions.onLoad as KeycloakOnLoad,
      silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
    })
    .then((auth) => {
      setIsAuthenticated(auth)
      setIsAuthenticating(false)

      if (auth) {
        ensureLogoutDoesNotRedirect()
      }

      return authenticationInstance.loadUserInfo()
    })
    .then((userInfo) => {
      setUserInfo(userInfo)
    })
    .catch(() => {
      // eslint-disable-next-line no-console
      console.error('Authenticated Failed')
    })
}

export const AuthenticationContext = createContext<AuthenticationContextValue>({
  isAuthenticated: false,
  isAuthenticating: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
})

export const AuthenticationContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)
  const [authenticatedAxios, setAuthenticatedAxios] = useState<
    AxiosInstance | undefined
  >()
  const [userInfo, setUserInfo] = useState<KeycloakUserInfo>({})

  const login = () => {
    if (isAuthenticated) return Promise.resolve()
    return authenticationInstance.login()
  }
  const logout = () => {
    return authenticationInstance.logout()
  }

  useEffect(() => {
    initializeAuthentication({
      setIsAuthenticated,
      setIsAuthenticating,
      setUserInfo,
    })
  }, [])

  useEffect(
    function initializeAuthenticatedAxios() {
      if (isAuthenticated) {
        const token = authenticationInstance.token

        if (!token) return

        const authenticatedAxios = getAuthenticatedAxios(token)

        setAuthenticatedAxios(() => {
          // because axios is a function, we have to use a function to add it to state
          // (so that it doesnt get called when being set)
          return authenticatedAxios
        })
      }
    },
    [isAuthenticated],
  )

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        authenticatedAxios,
        isAuthenticating,
        userInfo,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}

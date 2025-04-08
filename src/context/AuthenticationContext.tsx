import { useEffect, useState } from 'react'
import { ReactNode, createContext } from 'react'
import Keycloak, { KeycloakOnLoad } from 'keycloak-js'
import AuthenticatedAxios from '../library/axios'
import { toast } from 'react-toastify'
import { AxiosInstance } from 'axios'

export interface KeycloakUserInfo {
  sub?: string
  email_verified?: boolean
  name?: string
  preferred_username?: string
  given_name?: string
  family_name?: string
  email?: string
  workspaces?: string[]
}

interface AuthenticationContextValue {
  authenticatedAxiosInstance?: AuthenticatedAxios
  authenticatedAxios?: AxiosInstance
  isAuthenticated: boolean
  isAuthenticating: boolean
  isAuthenticationServiceError: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  token: string | undefined
  userInfo?: KeycloakUserInfo
  workspaceUserName?: string
  selectedWorkspace?: string
  setSelectedWorkspace: (workspace: string) => void
  availableWorkspaces: string[]
  showWorkspaceModal: boolean
  setShowWorkspaceModal: (show: boolean) => void
}

const initOptions = {
  url: import.meta.env.VITE_KEYCLOAK_URL as string,
  realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string,
  onLoad: 'check-sso',
  scope: 'workspaces',
}

const authenticationInstance = new Keycloak(initOptions)

const WORKSPACE_STORAGE_KEY = 'selectedWorkspace'

export const AuthenticationContext = createContext<AuthenticationContextValue>({
  isAuthenticated: false,
  isAuthenticating: false,
  isAuthenticationServiceError: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  token: undefined,
  setSelectedWorkspace: () => {
    throw new Error(
      'setSelectedWorkspace must be used within an AuthenticationContextProvider',
    )
  },
  availableWorkspaces: [],
  showWorkspaceModal: false,
  setShowWorkspaceModal: () => {
    throw new Error(
      'setShowWorkspaceModal must be used within an AuthenticationContextProvider',
    )
  },
})

export const AuthenticationContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)
  const [isAuthenticationServiceError, setIsAuthenticationServiceError] =
    useState<boolean>(false)
  const [authenticatedAxiosInstance, setAuthenticatedAxiosInstance] = useState<
    AuthenticatedAxios | undefined
  >()
  const [authenticatedAxios, setAuthenticatedAxios] = useState<
    AxiosInstance | undefined
  >()
  const [userInfo, setUserInfo] = useState<KeycloakUserInfo>({})
  const [token, setToken] = useState<string>()
  const [selectedWorkspace, setSelectedWorkspace] = useState<
    string | undefined
  >(() => {
    // Initialize from localStorage if available
    return localStorage.getItem(WORKSPACE_STORAGE_KEY) ?? undefined
  })
  const [showWorkspaceModal, setShowWorkspaceModal] = useState<boolean>(false)
  const workspaceUserName = selectedWorkspace ?? userInfo?.preferred_username
  const availableWorkspaces = userInfo?.workspaces ?? []

  // Update localStorage when workspace changes
  useEffect(() => {
    if (selectedWorkspace) {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, selectedWorkspace)
    } else {
      localStorage.removeItem(WORKSPACE_STORAGE_KEY)
    }
  }, [selectedWorkspace])

  const login = () => {
    if (isAuthenticated) return Promise.resolve()
    return authenticationInstance.login()
  }
  const logout = () => {
    // Clear selected workspace on logout
    localStorage.removeItem(WORKSPACE_STORAGE_KEY)
    setSelectedWorkspace(undefined)
    return authenticationInstance.logout()
  }

  useEffect(
    function initiializeAuthentication() {
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

      authenticationInstance.onTokenExpired = () => {
        authenticationInstance
          .updateToken()
          .then(() => {
            if (authenticationInstance.token) {
              authenticatedAxiosInstance?.updateToken(
                authenticationInstance.token,
              )
              setToken(authenticationInstance.token)
            }
          })
          .catch(() => {
            setIsAuthenticated(false)
            setUserInfo({})
            toast.error('Your session has expired. Please log in again.')
            void authenticationInstance.logout()
          })
      }

      authenticationInstance.onAuthLogout = () => {
        setIsAuthenticated(false)
        setUserInfo({})
        toast.error('You have been logged out by the system.')
      }

      if (authenticationInstance.didInitialize) return // this ensures vite HMR keeps working in development

      setIsAuthenticating(true)

      authenticationInstance
        .init({
          onLoad: initOptions.onLoad as KeycloakOnLoad,
          silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
        })
        .then((auth) => {
          setIsAuthenticated(auth)

          if (auth) {
            ensureLogoutDoesNotRedirect()
            setToken(authenticationInstance.token)
            return authenticationInstance.loadUserInfo()
          }
          return null
        })
        .then((userInfo) => {
          if (!userInfo) {
            return
          }
          const keycloakUserInfo = userInfo as KeycloakUserInfo
          setUserInfo(keycloakUserInfo)

          // Only show workspace modal if we have workspaces and no workspace is selected
          // or if the selected workspace is not in the available workspaces
          const storedWorkspace = localStorage.getItem(WORKSPACE_STORAGE_KEY)
          const workspaces = keycloakUserInfo.workspaces ?? []
          if (
            workspaces.length > 0 &&
            (!storedWorkspace || !workspaces.includes(storedWorkspace))
          ) {
            setShowWorkspaceModal(true)
          }
        })
        .catch((error) => {
          setIsAuthenticationServiceError(true)
          if (!error?.error?.includes('silent-check-sso')) {
            toast.error('Authentication service error. Please try again later.')
          }
        })
        .finally(() => {
          setIsAuthenticating(false)
        })
    },
    [authenticatedAxiosInstance],
  )

  useEffect(
    function initializeAuthenticatedAxios() {
      if (isAuthenticated && !!token) {
        const getUpdatedToken = async () => {
          await authenticationInstance.updateToken()

          return authenticationInstance.token
        }

        const AuthenticatedAxiosInstance = new AuthenticatedAxios(
          token,
          getUpdatedToken,
        )

        setAuthenticatedAxiosInstance(AuthenticatedAxiosInstance)
        setAuthenticatedAxios(() => {
          // because axios is a function, we have to use a function to add it to state
          // (so that it doesnt get called when being set)
          return AuthenticatedAxiosInstance.authenticatedAxios
        })
      }
    },
    [isAuthenticated, token],
  )

  return (
    <AuthenticationContext.Provider
      value={{
        authenticatedAxiosInstance,
        authenticatedAxios,
        isAuthenticated,
        isAuthenticating,
        isAuthenticationServiceError,
        login,
        logout,
        token,
        userInfo,
        workspaceUserName,
        selectedWorkspace,
        setSelectedWorkspace,
        availableWorkspaces,
        showWorkspaceModal,
        setShowWorkspaceModal,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}

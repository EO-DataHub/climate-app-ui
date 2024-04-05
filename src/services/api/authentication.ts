import Keycloak, { KeycloakOnLoad } from 'keycloak-js'
console.log('code outside of component, should only run once in dev envt')
const initOptions = {
  url: import.meta.env.VITE_KEYCLOAK_URL as string,
  realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string,
  onLoad: 'check-sso',
  KeycloakResponseType: 'code',
  flow: 'standard',
  emableLogging: true,
}

export interface AuthenticationService {
  getIsLoggedIn: () => void
  getToken: () => string | undefined
  initialize: () => void
  login: () => Promise<void>
  logout: () => Promise<void>
}

const authenticationInstance = new Keycloak(initOptions)

const initialize = () => {
  console.log('initi keycloak')
  authenticationInstance
    .init({
      onLoad: initOptions.onLoad as KeycloakOnLoad,
      silentCheckSsoRedirectUri:
        window.location.href + '/silent-check-sso.html',
      pkceMethod: 'S256',
    })
    .then(
      (auth) => {
        if (!auth) {
          console.error('Not Authenticated')
        } else {
          console.info('Authenticated', authenticationInstance)
        }
      },
      () => {
        console.error('Authenticated Failed')
      },
    )
}

const login = () => authenticationInstance.login()

const logout = () => authenticationInstance.logout()

const getToken = () => authenticationInstance.token

const getIsLoggedIn = () => !!authenticationInstance.token

export default {
  getIsLoggedIn,
  getToken,
  initialize,
  login,
  logout,
} as AuthenticationService

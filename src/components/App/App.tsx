// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '@radix-ui/themes/styles.css'
import {
  Theme as RadixTheme,
  ThemeProps as RadixThemeProps,
} from '@radix-ui/themes'

import './App.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import authenticationService from '../../services/api/authentication'
import { useMap } from '../Map/useMap'
import { useUploadedAssets } from '../../useUploadedAssets'
import { Assets } from '../pages/Assets'

// import axiosService from '../../services/axios'

const RADIX_THEME_PROPS: RadixThemeProps = {
  accentColor: 'yellow',
}

authenticationService.initialize()

// const authenticatedAxios = axiosService.getAuthenticatedAxios(
//   authenticationService,
// )

// const handleLogin = () => {
//   authenticationService
//     .login()
//     .then(() => {
//       console.log('logged in')
//     })
//     .catch((err) => {
//       console.error(err)
//     })
// }

// const handleLogout = () => {
//   authenticationService
//     .logout()
//     .then(() => {
//       console.log('logged out')
//     })
//     .catch((err) => {
//       console.error(err)
//     })
// }

function App() {
  const queryClient = new QueryClient()

  const { mapContainer, mapInstance } = useMap()
  const { loadUserAssets } = useUploadedAssets({ mapInstance })

  return (
    <QueryClientProvider client={queryClient}>
      <RadixTheme {...RADIX_THEME_PROPS}>
        <Assets loadUserAssets={loadUserAssets} mapContainer={mapContainer} />
      </RadixTheme>

      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      {/* will only show in dev environments */}
    </QueryClientProvider>
  )
}

export default App

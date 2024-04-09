import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '@radix-ui/themes/styles.css'
import {
  Button,
  Theme as RadixTheme,
  ThemeProps as RadixThemeProps,
  Text,
} from '@radix-ui/themes'

import './App.module.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Map } from '../Map/Map'
import { Layout } from '../Layout/Layout'
import authenticationService from '../../services/api/authentication'
import { useRef } from 'react'
import { useMap } from '../Map/useMap'
import { useUploadedAssets } from '../../useUploadedAssets'

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
  const uploadRef = useRef<HTMLInputElement>(null)
  const { mapContainer, mapInstance } = useMap()
  const { loadUserAssets } = useUploadedAssets({ mapInstance })

  const sidebarContent = (
    <>
      <Text>A hypothetical side bar</Text>
      {/* <Button onClick={handleLogin}>login demo</Button>
      <Button onClick={handleLogout}>logout demo</Button> */}
      <input
        type="file"
        id="upload-assets"
        hidden
        ref={uploadRef}
        onChange={(event) => loadUserAssets(event)}
        accept=".csv, .geojson"
      />
      <Button onClick={() => uploadRef.current?.click()}>
        Upload GeoJSON or CSV Assets
      </Button>
    </>
  )
  return (
    <QueryClientProvider client={queryClient}>
      <RadixTheme {...RADIX_THEME_PROPS}>
        <Layout
          map={<Map mapContainer={mapContainer} />}
          sidebarContent={sidebarContent}
        />
      </RadixTheme>

      <ReactQueryDevtools initialIsOpen={false} />
      {/* will only show in dev environments */}
    </QueryClientProvider>
  )
}

export default App

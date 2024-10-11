import {
  Theme as RadixTheme,
  ThemeProps as RadixThemeProps,
} from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import 'react-toastify/dist/ReactToastify.css'

import './App.module.css'

import { RouterProvider } from 'react-router-dom'
import { UserAssetsProvider } from '../../context/UserAssetsContext'
import { router } from './router'
import { LoadingContextProvider } from '../../context/LoadingContext'
import { AuthenticationContextProvider } from '../../context/AuthenticationContext'
import { HazardContextProvider } from '../../context/HazardsPageContext'
import { ObservationsContextProvider } from '../../context/ObservationsPageContext'
import { AssetsPageContextProvider } from '../../context/AssetsPageContext'

const RADIX_THEME_PROPS: RadixThemeProps = {
  accentColor: 'indigo',
}

function App() {
  return (
    <AuthenticationContextProvider>
      <LoadingContextProvider>
        <RadixTheme {...RADIX_THEME_PROPS}>
          <UserAssetsProvider>
            <HazardContextProvider>
              <ObservationsContextProvider>
                <AssetsPageContextProvider>
                  <RouterProvider router={router} />
                </AssetsPageContextProvider>
              </ObservationsContextProvider>
            </HazardContextProvider>
          </UserAssetsProvider>
        </RadixTheme>
      </LoadingContextProvider>
    </AuthenticationContextProvider>
  )
}

export default App

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

const RADIX_THEME_PROPS: RadixThemeProps = {
  accentColor: 'indigo',
}

function App() {
  return (
    <AuthenticationContextProvider>
      <LoadingContextProvider>
        <RadixTheme {...RADIX_THEME_PROPS}>
          <UserAssetsProvider>
            <RouterProvider router={router} />
          </UserAssetsProvider>
        </RadixTheme>
      </LoadingContextProvider>
    </AuthenticationContextProvider>
  )
}

export default App

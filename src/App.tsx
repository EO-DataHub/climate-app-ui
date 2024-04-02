import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '@radix-ui/themes/styles.css'
import {
  Theme as RadixTheme,
  ThemeProps as RadixThemeProps,
} from '@radix-ui/themes'

import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Map } from './Map'
import { Layout } from './Layout'

const RADIX_THEME_PROPS: RadixThemeProps = {
  accentColor: 'yellow',
}

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <RadixTheme {...RADIX_THEME_PROPS}>
        <Layout map={<Map />} />
      </RadixTheme>

      <ReactQueryDevtools initialIsOpen={false} />
      {/* will only show in dev environments */}
    </QueryClientProvider>
  )
}

export default App

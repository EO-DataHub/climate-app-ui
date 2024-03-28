import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Map } from './Map'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Map />

      <ReactQueryDevtools initialIsOpen={false} />
      {/* will only show in dev environments */}
    </QueryClientProvider>
  )
}

export default App

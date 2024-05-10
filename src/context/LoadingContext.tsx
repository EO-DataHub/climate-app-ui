import { useState } from 'react'
import { ReactNode, createContext } from 'react'

interface LoadingContextValue {
  isLoading: boolean
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
}
export const LoadingContext = createContext<LoadingContextValue>({
  isLoading: false,
})

export const LoadingContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

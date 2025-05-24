'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ErrorContextType {
  isError: boolean
  setIsError: (value: boolean) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [isError, setIsError] = useState(false)

  return (
    <ErrorContext.Provider value={{ isError, setIsError }}>
      {children}
    </ErrorContext.Provider>
  )
}

export function useError() {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
} 
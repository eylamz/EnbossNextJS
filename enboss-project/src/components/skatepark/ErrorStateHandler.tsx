'use client'

import { useEffect } from 'react'
import { useError } from '@/context/ErrorContext'

export default function ErrorStateHandler({ isClosed }: { isClosed: boolean }) {
  const { setIsError } = useError()

  useEffect(() => {
    setIsError(isClosed)
  }, [isClosed, setIsError])

  return null
} 
'use client'

import { Provider as ReduxProvider } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from '@/store'

/** Client-only providers (Redux + toast host), composed once at the root layout. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      {children}
      <Toaster position="top-center" richColors />
    </ReduxProvider>
  )
}

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  </React.StrictMode>
)

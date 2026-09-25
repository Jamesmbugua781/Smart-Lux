import { StrictMode } from 'react'
import type { ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/mona-sans'
import { ErrorBoundary } from 'react-error-boundary'
import './index.css'
import App from './App'
import { ErrorFallback } from './components/ErrorFallback'

function logRuntimeError(error: unknown, info: ErrorInfo) {
  console.error('SMART LUX runtime error:', error, info)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logRuntimeError}>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)

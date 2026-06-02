import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { CatalogProvider } from './context/CatalogContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CatalogProvider>
        <App />
      </CatalogProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

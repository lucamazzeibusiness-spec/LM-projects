import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AzubiProfilProvider } from './context/AzubiProfilContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AzubiProfilProvider>
        <App />
      </AzubiProfilProvider>
    </BrowserRouter>
  </StrictMode>,
)

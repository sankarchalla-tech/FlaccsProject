import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LoadingProvider } from './components/context/LoadingContext.tsx'
import { ThemeProvider } from './components/context/ThemeContext.tsx'
import './index.css'
import App from './App.tsx'
import { Loader } from 'lucide-react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Clear theme from localStorage to apply new default
if (typeof window !== 'undefined') {
  const currentTheme = localStorage.getItem('todoapp-theme');
  if (currentTheme === 'system' || !currentTheme) {
    localStorage.setItem('todoapp-theme', 'light');
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

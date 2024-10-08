import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './app.css'
import { WebSocketProvider } from './contexts/WebSocketContext.tsx'
import { RobotProvider } from './contexts/RobotContext.tsx'

if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
)
  document.documentElement.classList.add('dark')
else document.documentElement.classList.remove('dark')
const root = document.getElementById('root')
root!.setAttribute('class', 'bg-slate-200 dark:bg-slate-800')
createRoot(root!).render(
  <StrictMode>
    <RobotProvider>
      <WebSocketProvider url={import.meta.env.VITE_WS_URL}>
        <App />
      </WebSocketProvider>
    </RobotProvider>
  </StrictMode>
)

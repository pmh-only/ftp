import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import 'normalize.css'
import './main.css'
import '@fontsource-variable/roboto/index.css'
import '@fontsource-variable/merriweather/index.css'
import { Tooltip } from 'react-tooltip'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Tooltip id="tooltip" />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Tooltip } from 'react-tooltip'

import App from '../App'

import 'normalize.css'
import '@fontsource-variable/inter/index.css'
import './style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Tooltip id="tooltip" />
  </StrictMode>,
)

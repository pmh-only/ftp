import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '../App'

import 'normalize.css'
import './style.css'
import { Tooltip } from 'react-tooltip'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Tooltip id="tooltip" />
  </StrictMode>,
)

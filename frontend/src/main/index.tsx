import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Tooltip } from 'react-tooltip'

import App from '../App'
import '../i18n'

import '@fontsource-variable/noto-sans-kr/index.css'
import '@fontsource-variable/oswald/index.css'

import './style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
      <Tooltip id="tooltip" />
    </Suspense>
  </StrictMode>
)

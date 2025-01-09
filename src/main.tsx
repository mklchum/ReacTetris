import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TetrisCanvas from './TetraCanvas'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TetrisCanvas />
  </StrictMode>,
)

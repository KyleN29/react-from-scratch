import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StaticDistanceGrid from './components/StaticDistanceGrid.tsx'
import InteractiveDistanceGrid from './components/InteractiveDistanceGrid.tsx'
import MainInteractiveDistanceGrid from './components/MainInteractiveDistanceGrid.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StaticDistanceGrid />
    <MainInteractiveDistanceGrid />
  </StrictMode>,
)

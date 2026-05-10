import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { AnimatePresence } from 'framer-motion'

function App() {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])
  return (
    <AnimatePresence mode="wait">
      <AppRoutes key={location.pathname} />
    </AnimatePresence>
  )
}

export default App

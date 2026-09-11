import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '@/future/components/layout/Navbar'
import { Footer } from '@/future/components/layout/Footer'
import { AppRoutes } from '@/future/app/routes'

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <Navbar
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={() => setMenuOpen(false)}
      />
      <main className="app-main">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

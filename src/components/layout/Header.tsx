import { Bell, User, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { DarkModeToggle } from '../ui/DarkModeToggle'
import { SearchBar } from '../ui/SearchBar'

const NAV_LINKS = [
  { label: 'Finanzas', href: '#finanzas' },
  { label: 'Tecnología', href: '#tecnologia' },
  { label: 'Bienestar', href: '#bienestar' },
  { label: 'Trending', href: '#trending' },
]

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="TuSitio inicio">
      {/* Green diamond SVG */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect
          x="6"
          y="6"
          width="20"
          height="20"
          rx="3"
          transform="rotate(45 16 16)"
          fill="#10b981"
        />
        <rect
          x="10"
          y="10"
          width="12"
          height="12"
          rx="2"
          transform="rotate(45 16 16)"
          fill="white"
          fillOpacity="0.35"
        />
      </svg>
      <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
        TuSitio
      </span>
    </a>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop right section */}
          <div className="hidden md:flex items-center gap-3">
            <SearchBar />
            <DarkModeToggle />
            <button
              aria-label="Notificaciones"
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" aria-label="3 notificaciones nuevas" />
            </button>
            <button
              aria-label="Perfil de usuario"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              <User size={18} />
            </button>
          </div>

          {/* Mobile right icons */}
          <div className="flex md:hidden items-center gap-2">
            <DarkModeToggle />
            <button
              aria-label="Buscar"
              onClick={() => setMobileSearchOpen((o) => !o)}
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Search size={18} />
            </button>
            <button
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 dark:border-gray-800">
            <SearchBar placeholder="Buscar artículos..." />
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
          <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

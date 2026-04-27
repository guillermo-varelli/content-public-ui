import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { DarkModeToggle } from '../ui/DarkModeToggle'
import { SearchBar } from '../ui/SearchBar'

function Logo() {
 return (
 <a href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Xana inicio">
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
 Xana
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

 {/* Desktop right section */}
 <div className="hidden md:flex items-center gap-3">
 <SearchBar />
 <DarkModeToggle />
 </div>

 {/* Mobile right icons */}
 <div className="flex md:hidden items-center gap-2">
 <DarkModeToggle />
 <button
 aria-label="Buscar"
 onClick={() => setMobileSearchOpen((o) => !o)}
 className="flex items-center justify-center w-9 h-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
 >
 <Search size={18} />
 </button>
 <button
 aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
 onClick={() => setMobileMenuOpen((o) => !o)}
 className="flex items-center justify-center w-9 h-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
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

 </header>
 )
}

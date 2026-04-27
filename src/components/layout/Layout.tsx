import type { ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
 children: ReactNode
}

export function Layout({ children }: LayoutProps) {
 return (
 <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
 <Header />
 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {children}
 </main>
 <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
 <p>© 2026 Xana. Todos los derechos reservados.</p>
 <div className="flex gap-4">
 <a href="#" className="hover:text-primary-500 transition-colors">Privacidad</a>
 <a href="#" className="hover:text-primary-500 transition-colors">Términos</a>
 <a href="#" className="hover:text-primary-500 transition-colors">Contacto</a>
 </div>
 </div>
 </footer>
 </div>
 )
}

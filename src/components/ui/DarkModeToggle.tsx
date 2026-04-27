import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export function DarkModeToggle() {
 const { isDark, toggleTheme } = useTheme()

 return (
 <button
 onClick={toggleTheme}
 aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
 className="flex items-center justify-center w-9 h-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
 >
 {isDark ? <Sun size={18} /> : <Moon size={18} />}
 </button>
 )
}

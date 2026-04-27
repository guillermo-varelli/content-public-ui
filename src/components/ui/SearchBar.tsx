import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

interface SearchBarProps {
 placeholder?: string
}

export function SearchBar({ placeholder = 'Buscar artículos...' }: SearchBarProps) {
 const [searchParams, setSearchParams] = useSearchParams()
 const [value, setValue] = useState(searchParams.get('q') ?? '')

 useEffect(() => {
 setValue(searchParams.get('q') ?? '')
 }, [searchParams])

 function handleSubmit(e: React.FormEvent) {
 e.preventDefault()
 const q = value.trim()
 setSearchParams(q ? { q } : {})
 }

 function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
 const q = e.target.value
 setValue(q)
 if (q === '') setSearchParams({})
 }

 function handleClear() {
 setValue('')
 setSearchParams({})
 }

 return (
 <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
 <Search
 size={16}
 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
 />
 <input
 type="search"
 value={value}
 onChange={handleChange}
 placeholder={placeholder}
 className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
 />
 {value && (
 <button
 type="button"
 onClick={handleClear}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
 >
 <X size={14} />
 </button>
 )}
 </form>
 )
}

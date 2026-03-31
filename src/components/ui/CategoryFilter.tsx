import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { ArticleCategory } from '../../domain/article/article.types'
import { CATEGORIES } from '../../domain/category/category.types'

interface CategoryFilterProps {
  activeCategory: ArticleCategory | null
  onCategoryChange: (category: ArticleCategory | null) => void
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'popular', label: 'Más populares' },
  { value: 'oldest', label: 'Más antiguos' },
]

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const [sortOpen, setSortOpen] = useState(false)
  const [sortValue, setSortValue] = useState('newest')

  const activeSort = SORT_OPTIONS.find((o) => o.value === sortValue) ?? SORT_OPTIONS[0]

  function handleCategoryClick(id: ArticleCategory | 'all') {
    onCategoryChange(id === 'all' ? null : id)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Category tabs — horizontally scrollable on mobile */}
      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-1">
          {CATEGORIES.map((cat) => {
            const isActive =
              cat.id === 'all' ? activeCategory === null : activeCategory === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sort dropdown — hidden on very small screens */}
      <div className="relative hidden sm:block flex-shrink-0">
        <button
          onClick={() => setSortOpen((o) => !o)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {activeSort.label}
          <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
        </button>

        {sortOpen && (
          <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSortValue(opt.value)
                  setSortOpen(false)
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  opt.value === sortValue
                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

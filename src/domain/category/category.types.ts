import type { ArticleCategory } from '../article/article.types'

export interface Category {
  id: ArticleCategory | 'all'
  label: string
  color: string
  bgClass: string
  textClass: string
  badgeBgClass: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    label: 'Todos',
    color: '#10b981',
    bgClass: 'bg-primary-500',
    textClass: 'text-primary-600 dark:text-primary-400',
    badgeBgClass: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    color: '#7c3aed',
    bgClass: 'bg-violet-600',
    textClass: 'text-violet-600 dark:text-violet-400',
    badgeBgClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  },
  {
    id: 'tecnologia',
    label: 'Tecnología',
    color: '#2563eb',
    bgClass: 'bg-blue-600',
    textClass: 'text-blue-600 dark:text-blue-400',
    badgeBgClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    id: 'bienestar',
    label: 'Bienestar',
    color: '#10b981',
    bgClass: 'bg-emerald-600',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    badgeBgClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  {
    id: 'trending',
    label: 'Trending',
    color: '#f59e0b',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-600 dark:text-amber-400',
    badgeBgClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
]

export function getCategoryMeta(id: ArticleCategory | 'all'): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]
}

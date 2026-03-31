import type { Article } from '../../domain/article/article.types'
import { ArticleHeroCard } from './ArticleHeroCard'

interface HeroSectionProps {
  articles: Article[]
  isLoading: boolean
}

function HeroSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeroSection({ articles, isLoading }: HeroSectionProps) {
  const items = isLoading ? [] : articles.slice(0, 3)
  const skeletonCount = isLoading ? 3 : 0

  return (
    <section aria-label="Artículos destacados">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1 h-6 rounded-full bg-primary-500" aria-hidden />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Destacados</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((article) => (
          <ArticleHeroCard key={article.id} article={article} />
        ))}
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <HeroSkeleton key={`hero-skeleton-${i}`} />
        ))}
      </div>
    </section>
  )
}

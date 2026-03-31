import type { Article } from '../../domain/article/article.types'
import { ArticleCard } from './ArticleCard'

interface ArticleGridProps {
  articles: Article[]
  isLoading: boolean
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="flex items-center gap-3 pt-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ArticleGrid({ articles, isLoading }: ArticleGridProps) {
  const skeletons = isLoading && articles.length === 0 ? 6 : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
      {Array.from({ length: skeletons }).map((_, i) => (
        <SkeletonCard key={`skeleton-${i}`} />
      ))}
      {isLoading && articles.length > 0 &&
        Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={`skeleton-more-${i}`} />
        ))
      }
    </div>
  )
}

import type { ReactNode } from 'react'
import type { Article } from '../../domain/article/article.types'
import { ArticleCard } from './ArticleCard'

interface ArticleGridProps {
  articles: Article[]
  isLoading: boolean
}

function SkeletonHorizontal() {
  return (
    <div className="flex aspect-[2/1] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-pulse overflow-hidden">
      <div className="w-1/2 flex-shrink-0 bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 p-4 space-y-2.5 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 w-1/5" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 w-5/6" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 w-2/3" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 w-24" />
        </div>
      </div>
    </div>
  )
}

function SkeletonVertical() {
  return (
    <div className="relative aspect-video border border-gray-100 dark:border-gray-700 animate-pulse bg-gray-200 dark:bg-gray-700 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
        <div className="h-3 bg-white/20 w-3/4" />
        <div className="h-3 bg-white/20 w-full" />
      </div>
    </div>
  )
}

export function ArticleGrid({ articles, isLoading }: ArticleGridProps) {
  if (isLoading && articles.length === 0) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SkeletonVertical /><SkeletonVertical />
          <SkeletonVertical /><SkeletonVertical />
        </div>
        <SkeletonHorizontal />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonVertical /><SkeletonVertical />
          <SkeletonVertical /><SkeletonVertical />
        </div>
        <SkeletonHorizontal />
      </div>
    )
  }

  const elements: ReactNode[] = []

  for (let i = 0; i < articles.length; i += 5) {
    const vertical = articles.slice(i, i + 4)
    const horizontal = articles[i + 4]

    const rows = []
    for (let j = 0; j < vertical.length; j += 2) {
      rows.push(vertical.slice(j, j + 2))
    }

    elements.push(
      <div key={`vgrid-${i}`}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="group pb-4 mb-4 border-b border-gray-200 dark:border-gray-700"
          >
            {/* Cards */}
            <div className="grid grid-cols-2 gap-4">
              {row.map((a) => (
                <ArticleCard key={a.id} article={a} variant="vertical" />
              ))}
            </div>

            {/* Descripción con fade */}
            {row.length === 2 && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                {row.map((a) => (
                  <p
                    key={a.id + '-desc'}
                    className="
                      text-sm text-gray-600 dark:text-gray-400 
                      line-clamp-2 leading-snug 
                      opacity-0 translate-y-1
                      group-hover:opacity-100 group-hover:translate-y-0
                      transition-all duration-300
                    "
                  >
                    {a.excerpt}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )

    if (horizontal) {
      elements.push(
        <ArticleCard key={horizontal.id} article={horizontal} variant="horizontal" />
      )
    }
  }

  if (isLoading && articles.length > 0) {
    elements.push(
      <div key="sk-grid" className="grid grid-cols-2 gap-4">
        <SkeletonVertical /><SkeletonVertical />
        <SkeletonVertical /><SkeletonVertical />
      </div>
    )
    elements.push(<SkeletonHorizontal key="sk-h" />)
  }

  return <div className="space-y-4">{elements}</div>
}
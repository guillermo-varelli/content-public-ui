import type { ReactNode } from 'react'
import type { Article } from '../../domain/article/article.types'
import { ArticleCard } from './ArticleCard'

interface ArticleGridProps {
  articles: Article[]
  isLoading: boolean
}

function SkeletonHorizontal() {
  return (
    <div className="flex gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 animate-pulse">
      <div className="w-28 sm:w-36 aspect-[4/3] rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex-1 space-y-2.5 py-1">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/5" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="flex items-center gap-2 mt-3">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
      </div>
    </div>
  )
}

function SkeletonVertical() {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
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

  // Pattern per block of 5: 4 vertical (2×2 grid) then 1 horizontal
  const elements: ReactNode[] = []
  for (let i = 0; i < articles.length; i += 5) {
    const vertical = articles.slice(i, i + 4)
    const horizontal = articles[i + 4]

    elements.push(
      <div key={`vgrid-${i}`} className="grid grid-cols-2 gap-4">
        {vertical.map((a) => (
          <ArticleCard key={a.id} article={a} variant="vertical" />
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

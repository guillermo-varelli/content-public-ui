import type { ArticleCategory } from '../../domain/article/article.types'
import { getCategoryMeta } from '../../domain/category/category.types'

interface BadgeProps {
  category: ArticleCategory
  size?: 'sm' | 'md'
}

export function Badge({ category, size = 'sm' }: BadgeProps) {
  const meta = getCategoryMeta(category)

  const sizeClasses = size === 'md'
    ? 'px-3 py-1 text-sm font-semibold'
    : 'px-2.5 py-0.5 text-xs font-semibold'

  return (
    <span
      className={`inline-flex items-center rounded-full uppercase tracking-wide ${sizeClasses} ${meta.badgeBgClass}`}
    >
      {meta.label}
    </span>
  )
}

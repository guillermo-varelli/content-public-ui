import { Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Article } from '../../domain/article/article.types'
import { getCategoryMeta } from '../../domain/category/category.types'

interface ArticleCardProps {
  article: Article
  variant?: 'vertical' | 'horizontal'
}

export function ArticleCard({ article, variant = 'vertical' }: ArticleCardProps) {
  const navigate = useNavigate()
  const meta = getCategoryMeta(article.category)

  let formattedDate = ''
  try {
    formattedDate = format(parseISO(article.publishedAt), "d MMM, yyyy", { locale: es })
  } catch {
    formattedDate = ''
  }

  if (variant === 'horizontal') {
    return (
      <article
        onClick={() => navigate(`/article/${article.slug}`)}
        className="group flex aspect-[2/1] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
      >
        <div className="w-1/2 flex-shrink-0 h-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-between flex-1 min-w-0 p-4 overflow-hidden">
          <div>
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${meta.badgeBgClass}`}>
              {meta.label}
            </span>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-2 line-clamp-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {article.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed hidden sm:block">
              {article.excerpt}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-5 h-5 rounded-full object-cover flex-shrink-0"
            />
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 truncate">
              {article.author.name}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 ml-auto flex-shrink-0">
              <Clock size={10} />
              <span>{article.readTime} min</span>
            </div>
          </div>
        </div>
      </article>
    )
  }

  // Vertical variant
  return (
    <article
      onClick={() => navigate(`/article/${article.slug}`)}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Category badge overlay */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${meta.badgeBgClass}`}>
            {meta.label}
          </span>
        </div>
        {/* Read time badge */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium backdrop-blur-sm">
            <Clock size={9} />
            {article.readTime} min
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2 flex-1">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-gray-700/50">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
              {article.author.name}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{formattedDate}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

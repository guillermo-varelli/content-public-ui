import { Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Article } from '../../domain/article/article.types'
import { Badge } from '../ui/Badge'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const navigate = useNavigate()

  let formattedDate = ''
  try {
    formattedDate = format(parseISO(article.publishedAt), "d 'de' MMM, yyyy", { locale: es })
  } catch {
    formattedDate = ''
  }

  return (
    <article
      onClick={() => navigate(`/article/${article.slug}`)}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge category={article.category} />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-snug mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-3 mt-auto">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
              {article.author.name}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <span>{formattedDate}</span>
              <span aria-hidden>·</span>
              <Clock size={11} className="flex-shrink-0" />
              <span>{article.readTime} min</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

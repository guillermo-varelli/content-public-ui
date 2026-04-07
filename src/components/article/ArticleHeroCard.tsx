import { Clock, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Article } from '../../domain/article/article.types'

interface ArticleHeroCardProps {
  article: Article
}

export function ArticleHeroCard({ article }: ArticleHeroCardProps) {
  const navigate = useNavigate()

  let formattedDate = ''
  try {
    formattedDate = format(parseISO(article.publishedAt), "d 'de' MMMM, yyyy", { locale: es })
  } catch {
    formattedDate = ''
  }

  return (
    <article
      onClick={() => navigate(`/article/${article.slug}`)}
      className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
        <img
          src={article.image}
          alt={article.title}
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {article.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
              {article.author.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <span>{formattedDate}</span>
              <span aria-hidden>·</span>
              <Clock size={11} />
              <span>{article.readTime} min</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-medium flex-shrink-0">
            <BookOpen size={14} />
            <span>Leer</span>
          </div>
        </div>
      </div>
    </article>
  )
}

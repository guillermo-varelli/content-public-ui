import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useArticleDetailBySlug, useArticles } from '../domain/article/article.hooks'
import type { Article } from '../domain/article/article.types'

function formatDate(iso: string) {
  try {
    return format(parseISO(iso), "d 'de' MMMM, yyyy", { locale: es })
  } catch {
    return iso
  }
}

function RelatedList({ articles, navigate }: { articles: Article[]; navigate: (path: string) => void }) {
  return (
    <ul className="space-y-3">
      {articles.map((related) => (
        <li key={related.slug}>
          <button
            onClick={() => navigate(`/article/${related.slug}`)}
            className="group w-full flex items-stretch rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-1/2 flex-shrink-0 aspect-video">
              <img
                src={related.image}
                alt={related.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {related.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <Clock size={10} />
                <span>{related.readTime} min</span>
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { article, isLoading, error } = useArticleDetailBySlug(slug ?? null)
  const { articles: allArticles } = useArticles()
  const relatedArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 5)
  const sidebarArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 20)

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-3xl" />
        <div className="space-y-2">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
        </div>
        <div className="space-y-3 pt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" style={{ width: `${95 - i * 3}%` }} />
          ))}
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
          <ArrowLeft size={16} /> Volver
        </button>
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-6 py-5 text-red-700 dark:text-red-300">
          {error}
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse space-y-6">
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-3xl" />
      </div>
    )
  }

  const paragraphs = (article.content ?? article.excerpt).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:grid lg:grid-cols-[260px_1fr] lg:gap-10 lg:items-start">

      {/* Sidebar — solo desktop */}
      <aside className="hidden lg:block sticky top-8 self-start max-h-screen overflow-y-auto">
        {sidebarArticles.length > 0 && (
          <RelatedList articles={sidebarArticles} navigate={navigate} />
        )}
      </aside>

      {/* Contenido principal */}
      <article>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          Volver
        </button>

        {/* Hero image */}
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-10 shadow-xl">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
          <div className="absolute bottom-5 right-5 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
            <Clock size={11} />
            {article.readTime} min lectura
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-50 leading-tight tracking-tight mb-4">
          {article.title}
        </h1>

        {/* Date row */}
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6">
          <Calendar size={13} />
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        {/* Lead / excerpt */}
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium border-l-4 border-primary-400 dark:border-primary-600 pl-4 mb-10">
          {article.excerpt}
        </p>

        {/* Body */}
        <div className="space-y-5">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-base text-gray-700 dark:text-gray-300 leading-[1.85]"
            >
              {para}
            </p>
          ))}
        </div>

        {/* Artículos relacionados — abajo */}
        {relatedArticles.length > 0 && (
          <div className="mt-14 pt-10 border-t border-gray-100 dark:border-gray-700">
            <RelatedList articles={relatedArticles} navigate={navigate} />
          </div>
        )}

      </article>
    </div>
  )
}

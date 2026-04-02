import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useArticleDetailBySlug } from '../domain/article/article.hooks'
import { Badge } from '../components/ui/Badge'

function formatDate(iso: string) {
  try {
    return format(parseISO(iso), "d 'de' MMMM, yyyy", { locale: es })
  } catch {
    return iso
  }
}

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { article, isLoading, error } = useArticleDetailBySlug(slug ?? null)

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
    <article className="max-w-3xl mx-auto px-4 py-8">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
        Volver
      </button>

      {/* Hero image — full bleed, tall, rounded */}
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-10 shadow-xl">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
        <div className="absolute bottom-5 left-5">
          <Badge category={article.category} size="md" />
        </div>
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

    </article>
  )
}

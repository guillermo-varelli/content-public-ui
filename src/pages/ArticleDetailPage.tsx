import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Share2, BookOpen } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useArticleDetailBySlug, useArticles } from '../domain/article/article.hooks'
import { ArticleCard } from '../components/article/ArticleCard'
import { getCategoryMeta } from '../domain/category/category.types'
import type { Article } from '../domain/article/article.types'

function formatDate(iso: string) {
 try {
 return format(parseISO(iso), "d 'de' MMMM, yyyy", { locale: es })
 } catch {
 return iso
 }
}

function SidebarArticle({ article, navigate }: { article: Article; navigate: (path: string) => void }) {
 const meta = getCategoryMeta(article.category)
 return (
 <button
 onClick={() => navigate(`/article/${article.slug}`)}
 className="group w-full flex gap-3 text-left p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
 >
 <div className="w-20 h-16 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
 <img
 src={article.image}
 alt={article.title}
 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
 />
 </div>
 <div className="flex-1 min-w-0 py-0.5">
 <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 mb-1 ${meta.badgeBgClass}`}>
 {meta.label}
 </span>
 <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
 {article.title}
 </p>
 <p className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 mt-1">
 <Clock size={10} />
 {article.readTime} min
 </p>
 </div>
 </button>
 )
}

export function ArticleDetailPage() {
 const { slug } = useParams<{ slug: string }>()
 const navigate = useNavigate()
 const { article, isLoading, error } = useArticleDetailBySlug(slug ?? null)
 const { articles: allArticles } = useArticles()
 const relatedArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 4)
 const sidebarArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 8)

 // Loading
 if (isLoading) {
 return (
 <div className="flex gap-10 items-start">
 <div className="flex-1 min-w-0 animate-pulse space-y-6 py-2">
 <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 " />
 <div className="h-[380px] bg-gray-200 dark:bg-gray-700 " />
 <div className="space-y-3">
 <div className="h-8 bg-gray-200 dark:bg-gray-700 w-5/6" />
 <div className="h-8 bg-gray-200 dark:bg-gray-700 w-4/6" />
 </div>
 <div className="flex items-center gap-3 py-4">
 <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700" />
 <div className="space-y-1.5">
 <div className="h-3 bg-gray-200 dark:bg-gray-700 w-32" />
 <div className="h-3 bg-gray-200 dark:bg-gray-700 w-24" />
 </div>
 </div>
 <div className="space-y-3">
 {[...Array(10)].map((_, i) => (
 <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 " style={{ width: `${98 - i * 2}%` }} />
 ))}
 </div>
 </div>
 <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
 <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 h-96 animate-pulse" />
 </div>
 </div>
 )
 }

 // Error
 if (error) {
 return (
 <div className="max-w-3xl mx-auto py-10">
 <button
 onClick={() => navigate(-1)}
 className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
 >
 <ArrowLeft size={16} /> Volver
 </button>
 <div className=" bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-6 py-5 text-red-700 dark:text-red-300">
 {error}
 </div>
 </div>
 )
 }

 if (!article) return null

 const meta = getCategoryMeta(article.category)
 const paragraphs = (article.content ?? article.excerpt)
 .split(/\n{2,}/)
 .map((p) => p.trim())
 .filter(Boolean)

 return (
 <div className="flex gap-10 items-start">
 {/* Main article */}
 <div className="flex-1 min-w-0">
 {/* Back */}
 <button
 onClick={() => navigate(-1)}
 className="group inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors font-medium"
 >
 <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
 Volver
 </button>

 {/* Hero image */}
 <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-8 shadow-xl">
 <img
 src={article.image}
 alt={article.title}
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
 <div className="absolute top-4 left-4">
 <span className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm ${meta.badgeBgClass}`}>
 {meta.label}
 </span>
 </div>
 <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 ">
 <Clock size={11} />
 {article.readTime} min de lectura
 </div>
 </div>

 {/* Title */}
 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-50 leading-tight tracking-tight mb-5">
 {article.title}
 </h1>

 {/* Author + date + share */}
 <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
 <div className="flex items-center gap-3 min-w-0">
 <img
 src={article.author.avatar}
 alt={article.author.name}
 className="w-10 h-10 object-cover ring-2 ring-primary-200 dark:ring-primary-800 flex-shrink-0"
 />
 <div className="min-w-0">
 <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{article.author.name}</p>
 <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
 <Calendar size={11} />
 <span>{formatDate(article.publishedAt)}</span>
 </div>
 </div>
 </div>
 <button
 onClick={() =>
 navigator.share?.({ title: article.title, url: window.location.href }).catch(() => {})
 }
 className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex-shrink-0"
 >
 <Share2 size={14} />
 Compartir
 </button>
 </div>

 {/* Lead / excerpt */}
 <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium border-l-4 border-primary-400 dark:border-primary-600 pl-5 mb-10 italic">
 {article.excerpt}
 </p>

 {/* Body */}
 <div className="space-y-6">
 {paragraphs.map((para, i) => (
 <p key={i} className="text-base text-gray-700 dark:text-gray-300 leading-[1.9]">
 {para}
 </p>
 ))}
 </div>

 {/* Tags */}
 <div className="flex items-center gap-2 flex-wrap mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
 <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Temas:</span>
 <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold ${meta.badgeBgClass}`}>
 {meta.label}
 </span>
 </div>

 {/* Related — bottom on mobile */}
 {relatedArticles.length > 0 && (
 <div className="mt-12 lg:hidden">
 <div className="flex items-center gap-2 mb-5">
 <span className="w-1 h-5 bg-primary-500" aria-hidden />
 <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Más noticias</h2>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {relatedArticles.map((a) => (
 <ArticleCard key={a.id} article={a} variant="horizontal" />
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Sidebar — desktop */}
 <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-20">
 <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
 <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
 <BookOpen size={15} className="text-primary-500" />
 <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Más noticias</h3>
 </div>
 <div className="p-4 space-y-1">
 {sidebarArticles.map((a) => (
 <SidebarArticle key={a.id} article={a} navigate={navigate} />
 ))}
 </div>
 </div>
 </aside>
 </div>
 )
}

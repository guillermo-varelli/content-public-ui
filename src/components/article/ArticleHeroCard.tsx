import { Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Article } from '../../domain/article/article.types'
import { getCategoryMeta } from '../../domain/category/category.types'

interface ArticleHeroCardProps {
 article: Article
 variant?: 'main' | 'secondary'
}

export function ArticleHeroCard({ article, variant = 'secondary' }: ArticleHeroCardProps) {
 const navigate = useNavigate()
 const meta = getCategoryMeta(article.category)

 let formattedDate = ''
 try {
 formattedDate = format(parseISO(article.publishedAt), "d 'de' MMM", { locale: es })
 } catch {
 formattedDate = ''
 }

 if (variant === 'main') {
 return (
 <article
 onClick={() => navigate(`/article/${article.slug}`)}
 className="group relative w-full h-full min-h-[320px] sm:min-h-[400px] overflow-hidden cursor-pointer bg-gray-900"
 >
 <img
 src={article.image}
 alt={article.title}
 loading="eager"
 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-75"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
 <div className="absolute top-4 left-4 flex items-center gap-2">
 <span className={`inline-flex items-center px-3 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur-sm ${meta.badgeBgClass}`}>
 {meta.label}
 </span>
 <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 text-white text-[11px] font-semibold backdrop-blur-sm">
 <span className="w-1.5 h-1.5 bg-green-400 animate-pulse" />
 Destacado
 </span>
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
 <h2 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl leading-tight mb-2.5 line-clamp-3">
 {article.title}
 </h2>
 <p className="text-gray-300 text-sm line-clamp-2 mb-5 hidden sm:block">{article.excerpt}</p>
 <div className="flex items-center justify-between gap-4">
 <div className="flex items-center gap-2.5 min-w-0">
 <img
 src={article.author.avatar}
 alt={article.author.name}
 className="w-8 h-8 object-cover ring-2 ring-white/30 flex-shrink-0"
 />
 <div className="min-w-0">
 <p className="text-white text-xs font-semibold truncate">{article.author.name}</p>
 <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
 <span>{formattedDate}</span>
 <span aria-hidden>·</span>
 <Clock size={10} />
 <span>{article.readTime} min</span>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-1.5 text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2 text-xs font-bold transition-all flex-shrink-0 group-hover:bg-primary-500/80">
 <span>Leer</span>
 <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
 </div>
 </div>
 </div>
 </article>
 )
 }

 // Secondary: compact horizontal card
 return (
 <article
 onClick={() => navigate(`/article/${article.slug}`)}
 className="group flex gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer p-3"
 >
 <div className="relative w-24 h-20 sm:w-28 sm:h-20 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
 <img
 src={article.image}
 alt={article.title}
 loading="eager"
 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
 />
 </div>
 <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
 <div>
 <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 mb-1.5 ${meta.badgeBgClass}`}>
 {meta.label}
 </span>
 <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
 {article.title}
 </h3>
 </div>
 <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 mt-1">
 <span>{formattedDate}</span>
 <span aria-hidden>·</span>
 <Clock size={10} />
 <span>{article.readTime} min</span>
 </div>
 </div>
 </article>
 )
}

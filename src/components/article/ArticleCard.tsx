import { Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Article } from '../../domain/article/article.types'
import { getCategoryMeta } from '../../domain/category/category.types'

interface ArticleCardProps {
 article: Article
 variant?: 'vertical' | 'horizontal'
}

export function ArticleCard({ article, variant = 'vertical' }: ArticleCardProps) {
 const navigate = useNavigate()
 const meta = getCategoryMeta(article.category)

 if (variant === 'horizontal') {
 return (
 <article
 onClick={() => navigate(`/article/${article.slug}`)}
 className="group flex aspect-[2/1] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
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
 <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mb-2 ${meta.badgeBgClass}`}>
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
 className="w-5 h-5 object-cover flex-shrink-0"
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
 className="group relative overflow-hidden aspect-video border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
 >
 <img
 src={article.image}
 alt={article.title}
 loading="lazy"
 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
 <div className="absolute inset-0 flex flex-col justify-between p-3">
 <div>
 <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${meta.badgeBgClass}`}>
 {meta.label}
 </span>
 </div>
 <div>
 <h3 className="font-bold text-white text-sm leading-snug mb-2 line-clamp-3 group-hover:text-white/90 transition-colors">
 {article.title}
 </h3>
 <div className="flex items-center gap-2">
 <img
 src={article.author.avatar}
 alt={article.author.name}
 className="w-5 h-5 object-cover flex-shrink-0"
 />
 <span className="text-[11px] text-white/70 truncate flex-1 min-w-0">
 {article.author.name}
 </span>
 <div className="flex items-center gap-1 text-[10px] text-white/60 flex-shrink-0">
 <Clock size={9} />
 <span>{article.readTime} min</span>
 </div>
 </div>
 </div>
 </div>
 </article>
 )
}

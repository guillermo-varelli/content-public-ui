import { TrendingUp, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Article, ArticleCategory } from '../../domain/article/article.types'
import { getCategoryMeta, CATEGORIES } from '../../domain/category/category.types'

interface TrendingSidebarProps {
 articles: Article[]
 onCategoryChange?: (cat: ArticleCategory | null) => void
 activeCategory?: ArticleCategory | null
}

export function TrendingSidebar({ articles, onCategoryChange, activeCategory }: TrendingSidebarProps) {
 const navigate = useNavigate()

 return (
 <div className="space-y-5 sticky top-20">
 {/* Trending */}
 <div>
 <div className="flex items-center gap-2 mb-4">
 <span className="w-1 h-6 bg-orange-500" aria-hidden />
 <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Trending ahora</h3>
 </div>
 <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
 <div className="divide-y divide-gray-50 dark:divide-gray-700/30">
 {articles.slice(0, 6).map((article, index) => {
 const meta = getCategoryMeta(article.category)
 return (
 <button
 key={article.id}
 onClick={() => navigate(`/article/${article.slug}`)}
 className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors text-left group"
 >
 <span className={`text-xl font-black flex-shrink-0 w-6 text-right leading-tight mt-0.5 tabular-nums ${
 index === 0 ? 'text-orange-500' :
 index === 1 ? 'text-gray-400 dark:text-gray-500' :
 index === 2 ? 'text-amber-500' :
 'text-gray-200 dark:text-gray-700'
 }`}>
 {index + 1}
 </span>
 <div className="flex-1 min-w-0">
 <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 mb-1 ${meta.badgeBgClass}`}>
 {meta.label}
 </span>
 <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
 {article.title}
 </p>
 <p className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 mt-1">
 <Clock size={10} />
 {article.readTime} min de lectura
 </p>
 </div>
 </button>
 )
 })}
 </div>
 </div>
 </div>

 {/* Categories */}
 {onCategoryChange && (
 <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
 <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
 <TrendingUp size={15} className="text-primary-500" />
 <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Explorar temas</h3>
 </div>
 <div className="p-4 flex flex-wrap gap-2">
 {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
 const isActive = activeCategory === cat.id
 return (
 <button
 key={cat.id}
 onClick={() => onCategoryChange(isActive ? null : (cat.id as ArticleCategory))}
 className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-150 ${
 isActive
 ? `${cat.bgClass} text-white shadow-sm scale-105`
 : `${cat.badgeBgClass} hover:opacity-80 hover:scale-105`
 }`}
 >
 {cat.label}
 </button>
 )
 })}
 </div>
 </div>
 )}

 {/* Newsletter CTA */}
 <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-5 text-white shadow-sm">
 <p className="text-xs font-bold uppercase tracking-widest text-primary-200 mb-1">Newsletter</p>
 <h3 className="font-bold text-base mb-1.5">Las noticias que importan</h3>
 <p className="text-sm text-primary-100 mb-4">Recibí un resumen diario directamente en tu bandeja.</p>
 <button className="w-full bg-white text-primary-700 font-bold text-sm py-2.5 hover:bg-primary-50 transition-colors">
 Suscribirme gratis
 </button>
 </div>
 </div>
 )
}

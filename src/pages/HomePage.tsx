import { ChevronDown, Loader2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useArticles } from '../domain/article/article.hooks'
import { HeroSection } from '../components/article/HeroSection'
import { ArticleGrid } from '../components/article/ArticleGrid'
import { BreakingTicker } from '../components/article/BreakingTicker'
import { TrendingSidebar } from '../components/article/TrendingSidebar'
import type { ArticleCategory } from '../domain/article/article.types'

export function HomePage() {
 const [searchParams] = useSearchParams()
 const search = searchParams.get('q') ?? ''

 const {
 articles,
 featuredArticles,
 isLoading,
 error,
 hasMore,
 loadMore,
 setCategory,
 activeCategory,
 } = useArticles(search)

 function handleCategoryChange(cat: ArticleCategory | null) {
 setCategory(cat)
 }

 return (
 <div>
 {/* Breaking news ticker — full bleed within content area */}
 {!search && articles.length > 0 && (
 <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-8 overflow-hidden">
 <BreakingTicker articles={articles.slice(0, 8)} />
 </div>
 )}

 {/* Hero / Featured */}
 {!search && (
 <div className="mb-8">
 <HeroSection
 articles={featuredArticles}
 isLoading={featuredArticles.length === 0 && isLoading}
 />
 </div>
 )}

 {/* Main content: Feed + Sidebar */}
 <div className="flex gap-8 items-start">
 {/* Article feed */}
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-5">
 <span className="w-1 h-6 bg-primary-500" aria-hidden />
 <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
 {search
 ? `Resultados para "${search}"`
 : activeCategory
 ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
 : 'Últimas noticias'}
 </h2>
 </div>

 {error && (
 <div className=" bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-5 py-4 text-red-700 dark:text-red-300 text-sm mb-5">
 {error}
 </div>
 )}

 <ArticleGrid articles={articles} isLoading={isLoading} />

 {/* Load more */}
 {(hasMore || isLoading) && (
 <div className="flex justify-center mt-8">
 <button
 onClick={loadMore}
 disabled={isLoading}
 className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 border-2 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-sm"
 >
 {isLoading ? (
 <>
 <Loader2 size={16} className="animate-spin" />
 Cargando...
 </>
 ) : (
 <>
 <ChevronDown size={16} />
 Cargar más noticias
 </>
 )}
 </button>
 </div>
 )}

 {!isLoading && articles.length === 0 && !error && (
 <div className="text-center py-16">
 <p className="text-gray-400 dark:text-gray-500 text-lg">
 {search
 ? `No se encontraron artículos para "${search}".`
 : 'No hay artículos en esta categoría aún.'}
 </p>
 </div>
 )}
 </div>

 {/* Trending sidebar — desktop only */}
 {!search && (
 <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
 <TrendingSidebar
 articles={articles}
 onCategoryChange={handleCategoryChange}
 activeCategory={activeCategory}
 />
 </aside>
 )}
 </div>
 </div>
 )
}

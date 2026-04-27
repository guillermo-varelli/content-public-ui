import type { Article } from '../../domain/article/article.types'
import { ArticleHeroCard } from './ArticleHeroCard'
import { LiveFeed } from './LiveFeed'

interface HeroSectionProps {
 articles: Article[]
 isLoading: boolean
}

export function HeroSection({ articles, isLoading }: HeroSectionProps) {
 const mainArticle = isLoading ? null : articles[0]

 return (
 <section aria-label="Artículos destacados">
 <div className="flex items-center gap-2 mb-5">
 <span className="w-1 h-6 bg-primary-500" aria-hidden />
 <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Destacados</h2>
 </div>

 {/* Banner noticia principal */}
 <div className="mb-16 h-[260px] sm:h-[340px]">
 {isLoading ? (
 <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
 ) : mainArticle ? (
 <ArticleHeroCard article={mainArticle} variant="main" />
 ) : null}
 </div>

 {/* En vivo + Publicidad (sin margen derecho en En vivo) */}
 <div className="flex flex-col lg:flex-row lg:items-stretch">
 <div className="flex-1">
 <LiveFeed />
 </div>

 {/* Bloque de publicidad */}
 <div className="lg:w-72 xl:w-80 flex-shrink-0 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center min-h-[200px] lg:min-h-0">
 <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Publicidad</span>
 <span className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">300 × 250</span>
 </div>
 </div>
 </section>
 )
}

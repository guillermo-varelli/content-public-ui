import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useArticles } from '../domain/article/article.hooks'
import { HeroSection } from '../components/article/HeroSection'
import { ArticleGrid } from '../components/article/ArticleGrid'
import { CategoryFilter } from '../components/ui/CategoryFilter'
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
    <div className="space-y-10">
      {/* Hero / Featured */}
      {!search && (
        <HeroSection
          articles={featuredArticles}
          isLoading={featuredArticles.length === 0 && isLoading}
        />
      )}

      {/* Filter bar */}
      {!search && (
        <section>
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </section>
      )}

      {/* Article section header */}
      <section aria-label="Todos los artículos">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1 h-6 rounded-full bg-primary-500" aria-hidden />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {search
              ? `Resultados para "${search}"`
              : activeCategory
                ? `Artículos de ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`
                : 'Últimos artículos'}
          </h2>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-5 py-4 text-red-700 dark:text-red-300 text-sm mb-6">
            {error}
          </div>
        )}

        <ArticleGrid articles={articles} isLoading={isLoading} />

        {/* Load more button */}
        {(hasMore || isLoading) && (
          <div className="flex justify-center mt-10">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Cargando...
                </>
              ) : (
                'Cargar más artículos'
              )}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && articles.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500 text-lg">
              {search
                ? `No se encontraron artículos para "${search}".`
                : 'No hay artículos en esta categoría aún.'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

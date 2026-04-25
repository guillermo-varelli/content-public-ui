import type { Article } from '../../domain/article/article.types'
import { ArticleHeroCard } from './ArticleHeroCard'

interface HeroSectionProps {
  articles: Article[]
  isLoading: boolean
}

function MainHeroSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse bg-gray-200 dark:bg-gray-700 min-h-[320px] sm:min-h-[400px] lg:min-h-[460px]" />
  )
}

function SecondaryHeroSkeleton() {
  return (
    <div className="flex gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 animate-pulse border border-gray-100 dark:border-gray-700">
      <div className="w-24 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/4 mt-2" />
      </div>
    </div>
  )
}

export function HeroSection({ articles, isLoading }: HeroSectionProps) {
  const [main, ...secondary] = isLoading ? [] : articles.slice(0, 4)

  return (
    <section aria-label="Artículos destacados">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-1 h-6 rounded-full bg-primary-500" aria-hidden />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Destacados</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main hero — takes remaining space */}
        <div className="flex-1 min-h-[320px] sm:min-h-[400px] lg:min-h-[460px]">
          {isLoading
            ? <MainHeroSkeleton />
            : main
              ? <ArticleHeroCard article={main} variant="main" />
              : null
          }
        </div>

        {/* Secondary stack — same width as TrendingSidebar */}
        <div className="flex flex-col gap-3 lg:w-72 xl:w-80 lg:flex-shrink-0">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <SecondaryHeroSkeleton key={i} />)
            : secondary.map((article) => (
                <ArticleHeroCard key={article.id} article={article} variant="secondary" />
              ))
          }
        </div>
      </div>
    </section>
  )
}

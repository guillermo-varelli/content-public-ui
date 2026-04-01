import { useState, useEffect, useCallback } from 'react'
import type { Article, ArticleCategory, ContentReview } from './article.types'
import { getArticles, getContentReviewById } from './article.service'

const PAGE_SIZE = 20
const HERO_COUNT = 4

interface UseArticlesReturn {
  articles: Article[]
  featuredArticles: Article[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  setCategory: (category: ArticleCategory | null) => void
  activeCategory: ArticleCategory | null
}

export function useArticles(): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadArticles() {
      setIsLoading(true)
      setError(null)

      try {
        const res = await getArticles({
          page,
          pageSize: PAGE_SIZE,
          category: activeCategory ?? undefined,
        })

        if (!cancelled) {
          if (page === 1) {
            // First 4 fill the hero, the rest fill the grid
            setFeaturedArticles(res.articles.slice(0, HERO_COUNT))
            setArticles(res.articles.slice(HERO_COUNT))
          } else {
            setArticles((prev) => [...prev, ...res.articles])
          }
          setHasMore(res.hasMore)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar artículos')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadArticles()
    return () => { cancelled = true }
  }, [page, activeCategory])

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((p) => p + 1)
    }
  }, [isLoading, hasMore])

  const setCategory = useCallback((category: ArticleCategory | null) => {
    setActiveCategory(category)
    setPage(1)
    setArticles([])
    setFeaturedArticles([])
  }, [])

  return {
    articles,
    featuredArticles,
    isLoading,
    error,
    hasMore,
    loadMore,
    setCategory,
    activeCategory,
  }
}

export function useArticleDetail(id: number | null) {
  const [review, setReview] = useState<ContentReview | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === null) return
    let cancelled = false
    setIsLoading(true)
    setError(null)
    setReview(null)

    getContentReviewById(id)
      .then((r) => { if (!cancelled) setReview(r) })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Error') })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [id])

  return { review, isLoading, error }
}

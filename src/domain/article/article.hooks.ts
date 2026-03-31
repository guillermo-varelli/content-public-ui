import { useState, useEffect, useCallback } from 'react'
import type { Article, ArticleCategory, ContentReview } from './article.types'
import { getArticles, getContentReviewById } from './article.service'

const PAGE_SIZE = 6

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

  // Load featured articles once on mount
  useEffect(() => {
    let cancelled = false

    async function loadFeatured() {
      try {
        const res = await getArticles({ page: 1, pageSize: 3, featured: true })
        if (!cancelled) {
          setFeaturedArticles(res.articles)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load featured articles:', err)
        }
      }
    }

    void loadFeatured()
    return () => { cancelled = true }
  }, [])

  // Load regular articles whenever page or category changes
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
          featured: false,
        })

        if (!cancelled) {
          setArticles((prev) => (page === 1 ? res.articles : [...prev, ...res.articles]))
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

export function useFeaturedArticles() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    getArticles({ page: 1, pageSize: 3, featured: true })
      .then((res) => {
        if (!cancelled) setFeaturedArticles(res.articles)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { featuredArticles, isLoading, error }
}

import { useState, useEffect, useCallback } from 'react'
import type { Article, ArticleCategory } from './article.types'
import { getArticles, searchArticles, getArticleBySlug } from './article.service'

const PAGE_SIZE = 10
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

export function useArticles(search?: string): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | null>(null)

  const q = search?.trim() ?? ''

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        if (q) {
          const res = await searchArticles({ q, page, pageSize: PAGE_SIZE })
          if (!cancelled) {
            setFeaturedArticles([])
            if (page === 1) {
              setArticles(res.articles)
            } else {
              setArticles((prev) => [...prev, ...res.articles])
            }
            setHasMore(res.hasMore)
          }
        } else {
          const res = await getArticles({
            page,
            pageSize: PAGE_SIZE,
            category: activeCategory ?? undefined,
          })
          if (!cancelled) {
            if (page === 1) {
              setFeaturedArticles(res.articles.slice(0, HERO_COUNT))
              setArticles(res.articles.slice(HERO_COUNT))
            } else {
              setArticles((prev) => [...prev, ...res.articles])
            }
            setHasMore(res.hasMore)
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar artículos')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void load()
    return () => { cancelled = true }
  }, [page, activeCategory, q])

  useEffect(() => {
    setPage(1)
    setArticles([])
    setFeaturedArticles([])
  }, [q])

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

export function useArticleDetailBySlug(slug: string | null) {
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(slug !== null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setIsLoading(true)
    setError(null)
    setArticle(null)

    getArticleBySlug(slug)
      .then((a) => { if (!cancelled) setArticle(a) })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Error') })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [slug])

  return { article, isLoading, error }
}


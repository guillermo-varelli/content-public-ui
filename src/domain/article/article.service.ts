import type { Article, ArticleCategory, ArticlesResponse, ContentReview, GetArticlesParams } from './article.types'

const API_BASE = 'http://localhost:8081/api/v1'

// ─── HTTP ────────────────────────────────────────────────────────────────────

interface PaginatedContentResponse {
  reviews: ContentReview[]
  total: number
  hasMore: boolean
}

async function fetchPaginatedContent(
  page: number,
  pageSize: number,
  category?: string,
): Promise<PaginatedContentResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  })
  if (category) params.set('category', category)

  const res = await fetch(`${API_BASE}/content?${params}`)

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }

  const raw = await res.json()

  let reviews: ContentReview[]
  let total: number
  let hasMore: boolean

  if (Array.isArray(raw)) {
    reviews = raw as ContentReview[]
    total = reviews.length
    hasMore = reviews.length === pageSize
  } else if (Array.isArray(raw?.data)) {
    reviews = raw.data as ContentReview[]
    total = raw.total ?? reviews.length
    hasMore = raw.has_next ?? raw.has_more ?? raw.hasMore ?? page * pageSize < total
  } else if (Array.isArray(raw?.content_reviews)) {
    reviews = raw.content_reviews as ContentReview[]
    total = raw.total ?? reviews.length
    hasMore = raw.has_next ?? raw.has_more ?? raw.hasMore ?? page * pageSize < total
  } else if (Array.isArray(raw?.items)) {
    reviews = raw.items as ContentReview[]
    total = raw.total ?? reviews.length
    hasMore = raw.has_next ?? raw.has_more ?? raw.hasMore ?? page * pageSize < total
  } else {
    console.error('Unexpected /content response shape:', raw)
    reviews = []
    total = 0
    hasMore = false
  }

  return { reviews, total, hasMore }
}

// Cache for detail/featured lookups (large page to cover all articles)
let cachedAllReviews: ContentReview[] | null = null

async function fetchAllReviews(): Promise<ContentReview[]> {
  if (cachedAllReviews) return cachedAllReviews
  const { reviews } = await fetchPaginatedContent(1, 1000)
  cachedAllReviews = reviews
  return reviews
}

// ─── Mappers ────────────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, ArticleCategory> = {
  TECH: 'tecnologia',
  TECHNOLOGY: 'tecnologia',
  FINANCE: 'finanzas',
  FINANZAS: 'finanzas',
  HEALTH: 'bienestar',
  WELLNESS: 'bienestar',
  BIENESTAR: 'bienestar',
  TRENDING: 'trending',
}

function mapCategory(raw: string): ArticleCategory {
  return CATEGORY_MAP[raw?.toUpperCase()] ?? 'tecnologia'
}

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const PLACEHOLDER_AUTHORS = [
  { name: 'Ana López', avatar: 'https://i.pravatar.cc/40?img=1' },
  { name: 'Carlos Tech', avatar: 'https://i.pravatar.cc/40?img=3' },
  { name: 'María Wellness', avatar: 'https://i.pravatar.cc/40?img=5' },
  { name: 'Pedro Gómez', avatar: 'https://i.pravatar.cc/40?img=7' },
  { name: 'Laura Díaz', avatar: 'https://i.pravatar.cc/40?img=9' },
]

const CATEGORY_IMAGE_SEEDS: Record<string, string> = {
  TECH: 'technology',
  TECHNOLOGY: 'technology',
  FINANCE: 'finance',
  FINANZAS: 'finance',
  HEALTH: 'wellness',
  WELLNESS: 'wellness',
  BIENESTAR: 'wellness',
  TRENDING: 'trending',
}

function getImageUrl(review: ContentReview): string {
  return `https://picsum.photos/seed/article-${review.id}/800/450`
}

function mapReviewToArticle(review: ContentReview, index: number): Article {
  return {
    id: String(review.id),
    title: review.title,
    excerpt: review.short_description,
    content: review.message,
    image: getImageUrl(review),
    category: mapCategory(review.category),
    author: PLACEHOLDER_AUTHORS[index % PLACEHOLDER_AUTHORS.length],
    publishedAt: review.created ?? new Date(0).toISOString(),
    readTime: estimateReadTime(review.message),
    featured: false,
    slug: review.slug || slugify(review.title),
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getArticles(params: GetArticlesParams): Promise<ArticlesResponse> {
  const { reviews, total, hasMore } = await fetchPaginatedContent(
    params.page,
    params.pageSize,
    params.category,
  )

  const articles: Article[] = reviews.map((r, i) => ({
    ...mapReviewToArticle(r, i),
    featured: false,
  }))

  return { articles, total, page: params.page, pageSize: params.pageSize, hasMore }
}

export async function searchArticles(params: { q: string; page: number; pageSize: number }): Promise<ArticlesResponse> {
  const urlParams = new URLSearchParams({
    q: params.q,
    page: String(params.page),
    page_size: String(params.pageSize),
  })

  const res = await fetch(`${API_BASE}/content/search?${urlParams}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)

  const raw = await res.json()
  const reviews: ContentReview[] = Array.isArray(raw?.data) ? raw.data : []
  const articles = reviews.map((r, i) => mapReviewToArticle(r, i))

  return {
    articles,
    total: reviews.length,
    page: params.page,
    pageSize: params.pageSize,
    hasMore: raw.has_next ?? false,
  }
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const res = await fetch(`${API_BASE}/content/slug/${encodeURIComponent(slug)}`)
  if (res.ok) {
    const review: ContentReview = await res.json()
    const allReviews = await fetchAllReviews()
    const index = allReviews.findIndex((r) => r.id === review.id)
    return mapReviewToArticle(review, index >= 0 ? index : 0)
  }

  // fallback: buscar en caché local
  const reviews = await fetchAllReviews()
  const index = reviews.findIndex((r) => (r.slug || slugify(r.title ?? '')) === slug)
  if (index === -1) throw new Error(`Article not found: ${slug}`)
  return { ...mapReviewToArticle(reviews[index], index), featured: index < 3 }
}

export async function getContentReviewById(id: number): Promise<ContentReview> {
  const reviews = await fetchAllReviews()
  const review = reviews.find((r) => r.id === id)
  if (!review) throw new Error(`Review not found: ${id}`)
  return review
}

export function clearArticleCache(): void {
  cachedAllReviews = null
}

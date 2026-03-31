import type { Article, ArticleCategory, ArticlesResponse, ContentReview, GetArticlesParams } from './article.types'

const API_BASE = 'http://localhost:8080'

// TODO: move to env var once auth flow is in place
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcnM3Iiwic2NvcGVzIjpbImFnZW50czpyZWFkIiwid29ya2Zsb3dzOnJlYWQiLCJzdGVwOnJlYWQiLCJzdGVwOndyaXRlIiwic3RlcHM6cmVhZCIsInN0ZXBzOndyaXRlIiwid29ya2Zsb3dzOndyaXRlIiwiYWdlbnRzOndyaXRlIiwic3RlcC1leGVjdXRpb25zOnJlYWQiLCJzdGVwLWV4ZWN1dGlvbnM6d3JpdGUiLCJzdGVwLWV4ZWN1dGlvbnMtZ3JvdXBlZDpyZWFkIiwic3RlcC1leGVjdXRpb25zLWdyb3VwZWQ6d3JpdGUiLCJuOnJlYWQiLCJjb250ZW50LXJldmlld3M6cmVhZCIsImNvbnRlbnQtcmV2aWV3czp3cml0ZSJdLCJpc3MiOiJuLWJhY2tvZmZpY2UtYXBpIiwic3ViIjoidXNlcnM3IiwiZXhwIjoxNzc0OTk5NjQ5LCJuYmYiOjE3NzQ5MTMyNDksImlhdCI6MTc3NDkxMzI0OX0.uHqE3ju9JRklwk1efUseBumK9L9fdSipEUJsJmYEfl8'

// Simple in-memory cache so we don't re-fetch on every paginated call
let cachedReviews: ContentReview[] | null = null

async function fetchReviews(): Promise<ContentReview[]> {
  if (cachedReviews) return cachedReviews

  const res = await fetch(`${API_BASE}/content-reviews`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }

  const raw = await res.json()

  // The API may return an array directly or wrap it in an object
  // e.g. { data: [...] } | { content_reviews: [...] } | [...]
  let data: ContentReview[]
  if (Array.isArray(raw)) {
    data = raw as ContentReview[]
  } else if (Array.isArray(raw?.data)) {
    data = raw.data as ContentReview[]
  } else if (Array.isArray(raw?.content_reviews)) {
    data = raw.content_reviews as ContentReview[]
  } else if (Array.isArray(raw?.items)) {
    data = raw.items as ContentReview[]
  } else {
    console.error('Unexpected /content-reviews response shape:', raw)
    data = []
  }

  cachedReviews = data
  return data
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

// Estimate read time from message word count (~200 wpm)
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

// Deterministic placeholder avatar based on article id
const PLACEHOLDER_AUTHORS = [
  { name: 'Ana López', avatar: 'https://i.pravatar.cc/40?img=1' },
  { name: 'Carlos Tech', avatar: 'https://i.pravatar.cc/40?img=3' },
  { name: 'María Wellness', avatar: 'https://i.pravatar.cc/40?img=5' },
  { name: 'Pedro Gómez', avatar: 'https://i.pravatar.cc/40?img=7' },
  { name: 'Laura Díaz', avatar: 'https://i.pravatar.cc/40?img=9' },
]

// Category-specific seeds so fallback images look thematically consistent
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
  const hasValidUrl =
    typeof review.image_url === 'string' && review.image_url.trim().length > 0
  if (hasValidUrl) return review.image_url

  const seed = CATEGORY_IMAGE_SEEDS[review.category?.toUpperCase()] ?? `article-${review.id}`
  return `https://picsum.photos/seed/${seed}-${review.id}/800/450`
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
    publishedAt: review.created,
    readTime: estimateReadTime(review.message),
    featured: false, // assigned later based on position
    slug: slugify(review.title),
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getArticles(params: GetArticlesParams): Promise<ArticlesResponse> {
  const reviews = await fetchReviews()

  // Map and mark top-3 as featured
  let articles: Article[] = reviews.map((r, i) => ({
    ...mapReviewToArticle(r, i),
    featured: i < 3,
  }))

  // Filter by featured flag
  if (params.featured === true) {
    articles = articles.filter((a) => a.featured)
  } else if (params.featured === false) {
    articles = articles.filter((a) => !a.featured)
  }

  // Filter by category
  if (params.category) {
    articles = articles.filter((a) => a.category === params.category)
  }

  const total = articles.length
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const pageItems = articles.slice(start, end)

  return {
    articles: pageItems,
    total,
    page: params.page,
    pageSize: params.pageSize,
    hasMore: end < total,
  }
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const reviews = await fetchReviews()
  const index = reviews.findIndex((r) => slugify(r.title) === slug)
  if (index === -1) throw new Error(`Article not found: ${slug}`)
  return { ...mapReviewToArticle(reviews[index], index), featured: index < 3 }
}

export async function getContentReviewById(id: number): Promise<ContentReview> {
  const reviews = await fetchReviews()
  const review = reviews.find((r) => r.id === id)
  if (!review) throw new Error(`Review not found: ${id}`)
  return review
}

// Invalidate cache (useful for refresh / dev)
export function clearArticleCache(): void {
  cachedReviews = null
}

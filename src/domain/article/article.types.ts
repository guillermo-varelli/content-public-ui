export type ArticleCategory = 'finanzas' | 'tecnologia' | 'bienestar' | 'trending'

export interface Author {
  name: string
  avatar: string
}

export interface Article {
  id: string
  title: string
  excerpt: string
  content?: string
  image: string
  category: ArticleCategory
  author: Author
  publishedAt: string
  readTime: number
  featured: boolean
  slug: string
}

export interface ArticlesResponse {
  articles: Article[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface GetArticlesParams {
  page: number
  pageSize: number
  category?: ArticleCategory
  featured?: boolean
}

// Raw shape returned by GET /content-reviews
export interface ContentReview {
  id: number
  execution_id: number
  title: string
  short_description: string
  message: string
  status: string
  type: string
  sub_type: string
  category: string
  sub_category: string
  image_url: string
  image_prompt: string
  slug: string | null
  created: string
  last_updated: string
}

// SPEC: Article Domain
// This file describes the contract/behavior expected from the article domain.
// Each spec entry maps to a test or acceptance criterion.
// Use these specs as the source of truth when writing unit/integration tests.

export const ArticleSpec = {
  // SPEC-001: Articles must have required fields
  // An Article object must always contain: id, title, excerpt, image, category,
  // author (name + avatar), publishedAt (ISO string), readTime (number > 0),
  // featured (boolean), and slug (URL-safe string).
  REQUIRED_FIELDS: 'SPEC-001',

  // SPEC-002: Pagination must work correctly
  // getArticles({ page, pageSize }) must return exactly `pageSize` articles
  // when total > pageSize, and hasMore must be true. The last page must have
  // hasMore = false. Page index starts at 1.
  PAGINATION: 'SPEC-002',

  // SPEC-003: Category filter must return only articles of the requested category
  // getArticles({ category: 'finanzas' }) must return articles where
  // article.category === 'finanzas' exclusively.
  CATEGORY_FILTER: 'SPEC-003',

  // SPEC-004: Featured filter must return only featured articles
  // getArticles({ featured: true }) must return articles where article.featured === true.
  // These are used in the HeroSection (top 3 featured).
  FEATURED_FILTER: 'SPEC-004',

  // SPEC-005: getArticleBySlug must return a single article matching the slug
  // If no article matches, the function must throw an Error with a descriptive message.
  GET_BY_SLUG: 'SPEC-005',

  // SPEC-006: Load-more pattern must append articles to the existing list
  // Calling loadMore() increments the page counter and the new articles are
  // appended (not replaced) to the existing articles array in useArticles.
  LOAD_MORE_APPEND: 'SPEC-006',

  // SPEC-007: Changing the active category must reset pagination to page 1
  // Calling setCategory() must clear the current articles list and restart
  // fetching from page 1 with the new category filter applied.
  CATEGORY_RESET_PAGINATION: 'SPEC-007',

  // SPEC-008: Loading state must be set during async operations
  // isLoading must be true while an API request is in-flight and false once
  // the response resolves or rejects.
  LOADING_STATE: 'SPEC-008',

  // SPEC-009: Error state must be set when the API call fails
  // If getArticles rejects, useArticles must set error to a non-empty string
  // and isLoading to false.
  ERROR_STATE: 'SPEC-009',

  // SPEC-010: Mock service must respect the same contract as the real service
  // getMockArticles must return a valid ArticlesResponse with the same shape
  // as the production API response. The simulated delay must be >= 500ms.
  MOCK_CONTRACT: 'SPEC-010',
} as const

export type ArticleSpecKey = keyof typeof ArticleSpec
export type ArticleSpecValue = (typeof ArticleSpec)[ArticleSpecKey]

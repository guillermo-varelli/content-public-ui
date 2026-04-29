# Xana — content-public-ui

Portal de noticias público. React 18 + TypeScript + Vite + Tailwind CSS 3.4.

## Stack

- **Framework**: React 18, TypeScript (strict)
- **Build**: Vite 5, PostCSS + Autoprefixer
- **Router**: React Router DOM v7
- **Estilos**: Tailwind CSS 3.4 (`darkMode: 'class'`)
- **Íconos**: Lucide React
- **Fechas**: date-fns (locale `es`)
- **Dev server**: `npm run dev` → `http://localhost:5173` (o siguiente disponible)

## Rutas

| Path | Página |
|------|--------|
| `/` | `HomePage` |
| `/article/:slug` | `ArticleDetailPage` |

## API

- Proxy Vite: `/api` → `http://localhost:8080`
- Base real: `http://localhost:8081/api/v1`
- `VITE_USE_MOCK=true` activa mock data (12 artículos en `article.mock.ts`)
- `VITE_API_BASE_URL` para override de URL base

Endpoints:
- `GET /api/v1/content` — lista paginada (params: `category`, `page_size`)
- `GET /api/v1/content/search` — búsqueda (param: `q`)
- `GET /api/v1/content/slug/{slug}` — artículo por slug

## Arquitectura de carpetas

```
src/
├── components/
│   ├── article/
│   │   ├── ArticleCard.tsx          # card vertical + horizontal (variant prop)
│   │   ├── ArticleGrid.tsx          # feed mixto: 2H → 2V grid → repite
│   │   ├── ArticleHeroCard.tsx      # hero main (overlay) + secondary (compact)
│   │   ├── BreakingTicker.tsx       # ticker de últimas noticias animado
│   │   ├── HeroSection.tsx          # layout 2/3 + 1/3 asimétrico
│   │   └── TrendingSidebar.tsx      # ranking trending + categorías + newsletter CTA
│   ├── layout/
│   │   ├── Header.tsx               # header sticky con búsqueda y dark mode
│   │   └── Layout.tsx               # wrapper: header + main (max-w-7xl) + footer
│   └── ui/
│       ├── Badge.tsx                # badge de categoría
│       ├── CategoryFilter.tsx       # pills con emojis por categoría
│       ├── DarkModeToggle.tsx       # toggle sol/luna
│       └── SearchBar.tsx            # búsqueda por query param ?q=
├── domain/
│   └── article/
│       ├── article.hooks.ts         # useArticles, useArticleDetailBySlug, useArticleDetail
│       ├── article.mock.ts          # 12 artículos mock en español
│       ├── article.service.ts       # fetch + transformación ContentReview → Article
│       └── article.types.ts         # Article, ContentReview, ArticlesResponse, etc.
│   └── category/
│       └── category.types.ts        # CATEGORIES array, getCategoryMeta()
├── context/
│   └── ThemeContext.tsx             # dark mode con localStorage
└── pages/
    ├── HomePage.tsx                 # ticker + hero + filter + feed + sidebar
    └── ArticleDetailPage.tsx        # hero + autor + cuerpo + sidebar related
```

## Sistema de diseño

### Colores (tailwind.config.js)
- **Primary**: verde `#10b981` (500)
- **Finanzas**: violet `#7c3aed`
- **Tecnología**: blue `#2563eb`
- **Bienestar**: emerald `#10b981`
- **Trending**: amber `#f59e0b`

### Emojis de categoría (CategoryFilter)
- 🌐 Todos · 💰 Finanzas · 💻 Tecnología · 🌿 Bienestar · 🔥 Trending

### Animaciones (globals.css)
- `.animate-ticker` — scroll horizontal infinito (pausa en hover)
- `.animate-fade-in-up` — entrada suave hacia arriba
- `.animate-pulse-dot` — pulso del punto "En vivo"

## Diseño de páginas

### HomePage layout
```
[HeroSection — 1 card grande (2/3) + 3 secundarias (1/3)]
[CategoryFilter — pills con emojis]
[Feed (flex-1) | TrendingSidebar (w-72, desktop only)]
  Feed: patrón 2 horizontal → 2 vertical en grid → repite
  Sidebar: ranking trending + explorar categorías + newsletter CTA
```

### ArticleDetailPage layout
```
[Botón volver]
[Hero image 16/9 con badge categoría + tiempo lectura]
[Título H1]
[Autor + fecha + botón compartir]
[Lead excerpt (blockquote estilo)]
[Párrafos del cuerpo]
[Tags]
[Related (mobile: grid cards / desktop: sidebar compact)]
```
Sidebar desktop: lista compacta de 8 artículos relacionados con imagen + categoría + tiempo.

## Patrones importantes

- `ArticleCard` acepta `variant: 'vertical' | 'horizontal'`
- `ArticleHeroCard` acepta `variant: 'main' | 'secondary'`
- `ArticleGrid` agrupa artículos en bloques de 4: [H, H, [V, V]]
- `TrendingSidebar` es sticky (`top-20`) — no usar dentro de contenedores con overflow hidden
- Dark mode: añadir prefijo `dark:` a todas las clases de color
- Skeleton loaders en todos los componentes con estados de carga

## Comandos

```bash
npm run dev      # servidor local
npm run build    # build de producción (tsc + vite build)
npm run preview  # previsualizar build
```

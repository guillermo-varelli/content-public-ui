import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { MOCK_ARTICLES } from '../../domain/article/article.mock'
import type { ArticleCategory } from '../../domain/article/article.types'

interface FeedRow {
 key: number
 title: string
 category: ArticleCategory
 image: string
 slug: string
 receivedAt: number
}

const MAX_VISIBLE = 6
const INTERVAL_MS = 2500
const FEED_POOL = [...MOCK_ARTICLES, ...MOCK_ARTICLES, ...MOCK_ARTICLES]

function timeAgo(ts: number): string {
 const diff = Math.floor((Date.now() - ts) / 1000)
 if (diff < 60) return 'hace un momento'
 const mins = Math.floor(diff / 60)
 return `hace ${mins} min`
}

export function LiveFeed() {
 const navigate = useNavigate()
 const [rows, setRows] = useState<FeedRow[]>([])
 const [tick, setTick] = useState(0)

 useEffect(() => {
 let counter = 0
 let poolIndex = 0

 function nextRow(ago = 0): FeedRow {
 const article = FEED_POOL[poolIndex % FEED_POOL.length]
 poolIndex++
 return {
 key: counter++,
 title: article.title,
 category: article.category,
 image: article.image,
 slug: article.slug,
 receivedAt: Date.now() - ago,
 }
 }

 setRows([nextRow(7500), nextRow(5000), nextRow(2500)])

 const ticker = setInterval(() => {
 setRows(prev => [nextRow(), ...prev].slice(0, MAX_VISIBLE))
 }, INTERVAL_MS)

 const clock = setInterval(() => setTick(n => n + 1), 30_000)

 return () => {
 clearInterval(ticker)
 clearInterval(clock)
 }
 }, [])

 return (
 <div className="flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden">
 <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
 <span className="w-2 h-2 bg-red-500 animate-pulse" />
 <span className="text-xs font-bold text-red-500 uppercase tracking-wider">En vivo</span>
 <span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500">Publicaciones recientes</span>
 </div>

 <div className="flex-1 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700/50">
 {rows.map(row => (
 <div
 key={row.key}
 onClick={() => navigate(`/article/${row.slug}`)}
 className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 animate-fade-in-up"
 >
 <div className="w-10 h-10 overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
 <img src={row.image} alt="" className="w-full h-full object-cover" loading="lazy" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
 {row.title}
 </p>
 </div>
 <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0 ml-1">
 <Clock size={10} />
 <span className="whitespace-nowrap">{timeAgo(row.receivedAt)}</span>
 </div>
 </div>
 ))}
 </div>

 {/* invisible tick consumer to trigger re-render for time labels */}
 <span className="hidden">{tick}</span>
 </div>
 )
}

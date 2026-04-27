import { Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Article } from '../../domain/article/article.types'

interface BreakingTickerProps {
 articles: Article[]
}

export function BreakingTicker({ articles }: BreakingTickerProps) {
 const navigate = useNavigate()

 if (articles.length === 0) return null

 const items = [...articles, ...articles]

 return (
 <div className="bg-red-600 dark:bg-red-700 text-white overflow-hidden select-none">
 <div className="flex items-stretch">
 <div className="flex-shrink-0 bg-red-800 dark:bg-red-900 px-4 py-2.5 flex items-center gap-2 z-10 shadow-r">
 <span className="w-2 h-2 bg-white animate-pulse-dot flex-shrink-0" />
 <Zap size={13} className="fill-white flex-shrink-0" />
 <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap hidden xs:block">
 En vivo
 </span>
 </div>
 <div className="flex-1 overflow-hidden relative">
 <div className="flex animate-ticker py-2.5 whitespace-nowrap">
 {items.map((article, i) => (
 <button
 key={`${article.id}-${i}`}
 onClick={() => navigate(`/article/${article.slug}`)}
 className="inline-flex items-center gap-2.5 px-6 text-sm font-medium hover:text-red-100 transition-colors cursor-pointer"
 >
 <span className="text-red-300 text-[10px]">◆</span>
 <span>{article.title}</span>
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>
 )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ArticleDetailPage } from './pages/ArticleDetailPage'

export default function App() {
 return (
 <ThemeProvider>
 <BrowserRouter>
 <Layout>
 <Routes>
 <Route path="/" element={<HomePage />} />
 <Route path="/article/:slug" element={<ArticleDetailPage />} />
 </Routes>
 </Layout>
 </BrowserRouter>
 </ThemeProvider>
 )
}

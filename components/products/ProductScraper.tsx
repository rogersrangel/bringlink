"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Loader2, AlertCircle } from "lucide-react"

interface ProductScraperProps {
  onProductFetched: (data: any) => void
}

export function ProductScraper({ onProductFetched }: ProductScraperProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Detectar plataforma pela URL
  const detectPlatform = (url: string): string => {
    if (url.includes('shopee')) return 'shopee'
    if (url.includes('aliexpress')) return 'aliexpress'
    if (url.includes('mercadolivre') || url.includes('mercadolibre')) return 'mercadolivre'
    if (url.includes('amazon')) return 'amazon'
    return 'other'
  }

const handleScrape = async () => {
  if (!url) {
    setError("Por favor, insira uma URL")
    return
  }

  setLoading(true)
  setError("")

  try {
    const response = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })

    const data = await response.json()
    
    if (data.error) {
      setError(data.error)
    } else {
      // 🔥 FORMATAR OS DADOS CORRETAMENTE PARA O FORMULÁRIO
      const formattedData = {
        title: data.title || '',
        original_price: data.original_price || '',
        discounted_price: data.discounted_price || '',
        image: data.image || '',
        platform: data.platform || detectPlatform(url)
      }
      
      console.log("📤 Enviando dados formatados:", formattedData)
      onProductFetched(formattedData)
    }
  } catch (err) {
    setError("Erro ao buscar dados do produto")
    console.error("Erro no scraper:", err)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2">Importar de Link</h3>
      <p className="text-sm text-gray-600 mb-4">
        Cole o link do produto da Shopee, AliExpress, Mercado Livre ou Amazon
      </p>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.mercadolivre.com.br/produto-123..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            disabled={loading}
          />
          {url && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {url.includes('shopee') && <span className="text-lg">🛒</span>}
              {url.includes('aliexpress') && <span className="text-lg">📦</span>}
              {url.includes('mercadolivre') && <span className="text-lg">🛍️</span>}
              {url.includes('amazon') && <span className="text-lg">📚</span>}
            </div>
          )}
        </div>
        
        <motion.button
          onClick={handleScrape}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
          {loading ? "Buscando..." : "Importar"}
        </motion.button>
      </div>

      {error && (
        <motion.div 
          className="mt-3 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        ⚡ O sistema preencherá automaticamente título, preço e imagem
      </p>
    </div>
  )
}
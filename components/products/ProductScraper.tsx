"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Loader2, AlertCircle, Info } from "lucide-react"

interface ProductScraperProps {
  onProductFetched: (data: any) => void
}

export function ProductScraper({ onProductFetched }: ProductScraperProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showShopeeMessage, setShowShopeeMessage] = useState(false)
  const [showAliExpressMessage, setShowAliExpressMessage] = useState(false)

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

    const platform = detectPlatform(url)

    // 🔥 PLATAFORMAS COM SCRAPER COMPLETO
    if (platform === 'amazon' || platform === 'mercadolivre') {
      setShowShopeeMessage(false)
      setShowAliExpressMessage(false)
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
          // Formatar os dados para o formulário
          let finalPrice = data.price

          // Ajustar preços do Mercado Livre (vêm em centavos)
          if (data.price && data.price > 1000 && data.platform === 'mercadolivre') {
            finalPrice = data.price / 100
          }

          const formattedData = {
            title: data.title || '',
            original_price: data.original_price || finalPrice || '',
            discounted_price: data.discounted_price || finalPrice || '',
            image: data.image || '',
            platform: data.platform || platform
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
      return
    }

    // 🔥 PLATAFORMAS COM SCRAPER PARCIAL (SÓ TÍTULO E IMAGEM)
    if (platform === 'shopee' || platform === 'aliexpress') {
      // Mostra a mensagem apropriada
      if (platform === 'shopee') {
        setShowShopeeMessage(true)
        setShowAliExpressMessage(false)
      } else {
        setShowAliExpressMessage(true)
        setShowShopeeMessage(false)
      }
      
      setLoading(true)
      setError("")

      try {
        // 🔥 TENTA EXTRAIR PELO MENOS TÍTULO E IMAGEM
        const response = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        })

        const data = await response.json()

        // Mesmo que os preços venham null, aproveita título e imagem
        const formattedData = {
          title: data.title || '',
          original_price: '',  // Deixa em branco para preenchimento manual
          discounted_price: '', // Deixa em branco para preenchimento manual
          image: data.image || '',
          platform: platform
        }

        console.log("📤 Enviando dados parciais (título/imagem):", formattedData)
        onProductFetched(formattedData)
        
      } catch (err) {
        // Se falhar completamente, pelo menos não quebra
        console.error("Erro ao buscar dados parciais:", err)
      } finally {
        setLoading(false)
      }
      return
    }

    // Fallback para outras plataformas
    setError("Plataforma não suportada para importação automática")
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setShowShopeeMessage(false)
    setShowAliExpressMessage(false)
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
            onChange={handleUrlChange}
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

      {/* MENSAGEM PARA SHOPEE */}
      {showShopeeMessage && (
        <motion.div
          className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Info size={20} className="text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">
                🛒 API da Shopee em desenvolvimento
              </h4>
              <p className="text-sm text-yellow-700">
                A importação automática de preços para Shopee está temporariamente indisponível.
                <span className="font-medium"> Título e imagem foram preenchidos automaticamente!</span>
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                ⚡ Preencha os preços manualmente. O link de afiliado será salvo normalmente.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* MENSAGEM PARA ALIEXPRESS */}
      {showAliExpressMessage && (
        <motion.div
          className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Info size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">
                📦 AliExpress - Preços temporariamente indisponíveis
              </h4>
              <p className="text-sm text-blue-700">
                O AliExpress possui proteções que impedem a importação automática de preços.
                <span className="font-medium"> Título e imagem foram preenchidos automaticamente!</span>
              </p>
              <p className="text-xs text-blue-600 mt-2">
                ⚡ Preencha os preços manualmente. O link de afiliado será salvo normalmente.
              </p>
            </div>
          </div>
        </motion.div>
      )}

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

      {/* LEGENDA ATUALIZADA */}
      <p className="text-xs text-gray-400 mt-3 border-t pt-3">
        <span className="text-green-600">✅ Amazon e Mercado Livre</span>: preenchimento completo • 
        <span className="text-yellow-600"> 🛒 Shopee</span>: título e imagem • 
        <span className="text-blue-600"> 📦 AliExpress</span>: título e imagem
      </p>
    </div>
  )
}
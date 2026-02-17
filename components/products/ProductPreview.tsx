"use client"

import { motion } from "framer-motion"
import { ShoppingCart, ExternalLink } from "lucide-react"

interface ProductPreviewProps {
  data: {
    title: string
    price: number
    originalPrice?: number
    image?: string | null
    platform?: string
  }
}

export function ProductPreview({ data }: ProductPreviewProps) {
  const discount = data.originalPrice 
    ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)
    : 0

  const getPlatformIcon = () => {
    switch(data.platform) {
      case "shopee": return "🛒"
      case "aliexpress": return "📦"
      case "mercadolivre": return "🛍️"
      case "amazon": return "📚"
      default: return "🔗"
    }
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-sm mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative h-48 bg-gray-100">
        {data.image ? (
          <img 
            src={data.image} 
            alt={data.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-4xl">
            {getPlatformIcon()}
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
            -{discount}%
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {data.title || "Título do Produto"}
        </h3>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-green-600">
            R$ {data.price?.toFixed(2) || "0,00"}
          </span>
          {data.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              R$ {data.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 opacity-75 cursor-not-allowed">
          <ShoppingCart size={18} />
          Preview
          <ExternalLink size={16} />
        </button>

        <p className="text-xs text-gray-400 text-center mt-2">
          ⚡ Preview em tempo real
        </p>
      </div>
    </motion.div>
  )
}
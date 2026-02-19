"use client"

import { motion } from "framer-motion"
import { ShoppingCart, ExternalLink, Heart } from "lucide-react"
import { useState } from "react"
import { TrackLink } from "@/components/tracking/TrackLink"

interface ProductCardProps {
  product: {
    id: string
    title: string
    description?: string
    original_price: number
    discounted_price: number
    discount_percentage: number
    image_url: string | null
    product_url: string
    platform?: string
    category?: string
    clicks_count?: number
  }
  onTrackClick?: (productId: string) => void
}

export function ProductCard({ product, onTrackClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const getPlatformIcon = () => {
    switch (product.platform) {
      case "shopee": return "🛒"
      case "aliexpress": return "📦"
      case "mercadolivre": return "🛍️"
      case "amazon": return "📚"
      default: return "🔗"
    }
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Imagem */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-4xl">
            {getPlatformIcon()}
          </div>
        )}

        {product.discount_percentage > 0 && (
          <motion.div
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold"
            initial={{ rotate: 0 }}
            animate={isHovered ? { rotate: [0, -5, 5, -5, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            -{product.discount_percentage}%
          </motion.div>
        )}

        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 left-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart
            size={18}
            className={isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}
          />
        </button>

        {product.platform && (
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
            {getPlatformIcon()} {product.platform}
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="p-4">
        {/* 🔥 TÍTULO COM LIMITE DE 2 LINHAS */}
        <h3 
          className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]"
          title={product.title}
        >
          {product.title}
        </h3>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-green-600">
            R$ {product.discounted_price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            R$ {product.original_price.toFixed(2)}
          </span>
        </div>

        {product.clicks_count !== undefined && (
          <div className="text-xs text-gray-500 mb-3">
            🔥 {product.clicks_count} cliques
          </div>
        )}

        <TrackLink
          productId={product.id}
          href={product.product_url}
          className="w-full"
        >
          <motion.button
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart size={18} />
            Comprar agora
            <ExternalLink size={16} />
          </motion.button>
        </TrackLink>
      </div>
    </motion.div>
  )
}
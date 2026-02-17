"use client"

import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  title: string
  price: number
  originalPrice: number
  discount: number
  image: string
  category?: string
}

export function ProductCard({ title, price, originalPrice, discount, image, category }: ProductCardProps) {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
    >
      {/* Badge de desconto */}
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        </div>
        
        {/* Imagem placeholder */}
        <div className="h-40 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          <span className="text-4xl">{image}</span>
        </div>
      </div>

      {/* Informações */}
      <div className="p-4">
        {category && (
          <span className="text-xs text-gray-500">{category}</span>
        )}
        <h3 className="font-semibold text-sm mt-1 line-clamp-2">{title}</h3>
        
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-gray-400 line-through text-xs">
            R$ {originalPrice.toFixed(2)}
          </span>
          <span className="text-lg font-bold text-green-600">
            R$ {price.toFixed(2)}
          </span>
        </div>

        <motion.button
          className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart size={16} />
          Ver Produto
        </motion.button>
      </div>
    </motion.div>
  )
}
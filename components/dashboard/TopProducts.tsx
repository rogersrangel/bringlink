"use client"

import { motion } from "framer-motion"
import { ExternalLink, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  title: string
  clicks: number
  price: number
  image: string
}

export function TopProducts() {
  // Dados mockados
  const products: Product[] = [
    {
      id: "1",
      title: "Headset Gamer RGB Wireless",
      clicks: 234,
      price: 129.90,
      image: "🎧"
    },
    {
      id: "2",
      title: "Mouse Sem Fio Logitech",
      clicks: 189,
      price: 199.90,
      image: "🖱️"
    },
    {
      id: "3",
      title: "Cadeira Gamer Thunder X3",
      clicks: 156,
      price: 899.90,
      image: "🪑"
    },
    {
      id: "4",
      title: "Teclado Mecânico RGB",
      clicks: 98,
      price: 329.90,
      image: "⌨️"
    }
  ]

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Produtos mais clicados</h2>
        <Link href="/products" className="text-sm text-purple-600 hover:text-purple-700">
          Ver todos
        </Link>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
              {product.image}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{product.title}</p>
              <p className="text-xs text-gray-500">R$ {product.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-sm">{product.clicks}</p>
                <p className="text-xs text-gray-500">cliques</p>
              </div>
              
              <Link href={`/products/${product.id}`}>
                <ExternalLink size={16} className="text-gray-400 hover:text-purple-600" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total de cliques</span>
          <span className="font-semibold">677</span>
        </div>
      </div>
    </motion.div>
  )
}
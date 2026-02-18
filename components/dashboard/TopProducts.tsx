"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface TopProductsProps {
  products: any[]
}

export function TopProducts({ products }: TopProductsProps) {
  // Pegar top 5 produtos mais clicados
  const topProducts = [...products]
    .sort((a, b) => (b.clicks_count || 0) - (a.clicks_count || 0))
    .slice(0, 5)

  const totalClicks = topProducts.reduce((acc, p) => acc + (p.clicks_count || 0), 0)

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-semibold mb-4">Produtos mais clicados</h2>

      {topProducts.length > 0 ? (
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm">
                {product.image_url ? (
                  <img src={product.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span>🛒</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{product.title}</p>
                <p className="text-xs text-gray-500">
                  {product.clicks_count || 0} cliques
                </p>
              </div>
              
              <Link href={`/products/${product.id}/edit`}>
                <ExternalLink size={16} className="text-gray-400 hover:text-purple-600" />
              </Link>
            </motion.div>
          ))}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total de cliques</span>
              <span className="font-semibold">{totalClicks}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum clique ainda</p>
          <p className="text-xs text-gray-400 mt-1">
            Os cliques aparecerão aqui quando alguém comprar
          </p>
        </div>
      )}
    </motion.div>
  )
}
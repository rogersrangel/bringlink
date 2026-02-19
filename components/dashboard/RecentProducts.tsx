"use client"

import { motion } from "framer-motion"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

interface RecentProductsProps {
  products: any[]
}

export function RecentProducts({ products }: RecentProductsProps) {
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Produtos recentes</h2>
        <Link 
          href="/products/new" 
          className="flex items-center gap-1 text-sm bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusCircle size={16} />
          Novo
        </Link>
      </div>

      {recentProducts.length > 0 ? (
        <div className="space-y-3">
          {recentProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm shrink-0">
                {product.image_url ? (
                  <img src={product.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span>📦</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0"> {/* ← IMPORTANTE */}
                <p 
                  className="text-sm font-medium truncate"
                  title={product.title} // ← Mostra o texto completo no hover
                >
                  {product.title}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(product.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                product.is_active 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {product.is_active ? "Ativo" : "Inativo"}
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum produto ainda</p>
          <Link 
            href="/products/new"
            className="text-sm text-purple-600 hover:text-purple-700 mt-2 inline-block"
          >
            Adicionar primeiro produto →
          </Link>
        </div>
      )}

      {recentProducts.length > 0 && (
        <Link 
          href="/products" 
          className="block text-center text-sm text-purple-600 hover:text-purple-700 mt-4 pt-3 border-t border-gray-100"
        >
          Ver todos os produtos →
        </Link>
      )}
    </motion.div>
  )
}
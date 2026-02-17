"use client"

import { motion } from "framer-motion"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

interface RecentProduct {
  id: string
  title: string
  addedAt: string
  status: "active" | "inactive"
  image: string
}

export function RecentProducts() {
  const products: RecentProduct[] = [
    {
      id: "1",
      title: "Controle Pro Xbox Series X",
      addedAt: "Hoje, 10:30",
      status: "active",
      image: "🎮"
    },
    {
      id: "2",
      title: "Headset Razer Kraken X",
      addedAt: "Ontem",
      status: "active",
      image: "🎧"
    },
    {
      id: "3",
      title: "Suporte Monitor Articulado",
      addedAt: "15/02",
      status: "inactive",
      image: "💺"
    }
  ]

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

      <div className="space-y-3">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
              {product.image}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium">{product.title}</p>
              <p className="text-xs text-gray-500">{product.addedAt}</p>
            </div>
            
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.status === "active" 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-100 text-gray-600"
            }`}>
              {product.status === "active" ? "Ativo" : "Inativo"}
            </span>
          </motion.div>
        ))}
      </div>

      <Link 
        href="/products" 
        className="block text-center text-sm text-purple-600 hover:text-purple-700 mt-4 pt-3 border-t border-gray-100"
      >
        Ver todos os produtos →
      </Link>
    </motion.div>
  )
}
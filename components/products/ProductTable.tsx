"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProductActions } from "./ProductActions"
import { ChevronDown, ChevronUp, Package } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  title: string
  image_url: string | null
  original_price: number
  discounted_price: number
  discount_percentage: number
  platform: string | null
  category: string | null
  is_active: boolean
  is_featured: boolean
  clicks_count: number
  created_at: string
}

interface ProductTableProps {
  products: Product[]
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate?: (id: string) => void
}

export function ProductTable({ products, onToggleStatus, onDelete, onDuplicate }: ProductTableProps) {
  const [sortField, setSortField] = useState<"title" | "price" | "discount" | "clicks" | "created_at">("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const sortedProducts = [...products].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case "title": comparison = a.title.localeCompare(b.title); break
      case "price": comparison = a.discounted_price - b.discounted_price; break
      case "discount": comparison = a.discount_percentage - b.discount_percentage; break
      case "clicks": comparison = a.clicks_count - b.clicks_count; break
      case "created_at": comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); break
    }
    return sortOrder === "asc" ? comparison : -comparison
  })

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum produto ainda</h3>
        <p className="text-gray-500 mb-6">Comece adicionando seu primeiro produto</p>
        <Link href="/products/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg">
          Adicionar Produto
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Produto</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Preço</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Desconto</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Plataforma</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cliques</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Data</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <AnimatePresence>
            {sortedProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center text-xl">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span>📦</span>
                      )}
                    </div>
                    <Link href={`/products/${product.id}/edit`} className="font-medium hover:text-purple-600">
                      {product.title}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-green-600">R$ {product.discounted_price.toFixed(2)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">-{product.discount_percentage}%</span>
                </td>
                <td className="px-4 py-3">{product.platform || "Outra"}</td>
                <td className="px-4 py-3">{product.clicks_count}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${product.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {product.is_active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(product.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 text-right">
                  <ProductActions
                    productId={product.id}
                    isActive={product.is_active}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                  />
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}
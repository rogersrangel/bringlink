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
  profiles?: {  // ← RELACIONAMENTO COM PROFILES
    username: string
  }
}

interface ProductTableProps {
  products: Product[]
  onToggleStatus: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate?: (id: string) => void
  userUsername?: string // ← FALLBACK
}

type SortField = "title" | "price" | "discount" | "clicks" | "created_at"
type SortOrder = "asc" | "desc"

export function ProductTable({
  products,
  onToggleStatus,
  onDelete,
  onDuplicate,
  userUsername
}: ProductTableProps) {
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const sortedProducts = [...products].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "title":
        comparison = a.title.localeCompare(b.title)
        break
      case "price":
        comparison = a.discounted_price - b.discounted_price
        break
      case "discount":
        comparison = a.discount_percentage - b.discount_percentage
        break
      case "clicks":
        comparison = a.clicks_count - b.clicks_count
        break
      case "created_at":
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        break
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  const getPlatformIcon = (platform: string | null) => {
    switch (platform) {
      case "shopee": return "🛒"
      case "aliexpress": return "📦"
      case "mercadolivre": return "🛍️"
      case "amazon": return "📚"
      default: return "🔗"
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  // Estado de lista vazia
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum produto ainda</h3>
        <p className="text-gray-500 mb-6">Comece adicionando seu primeiro produto</p>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          Adicionar Produto
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("price")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Preço
                  <SortIcon field="price" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("discount")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Desconto
                  <SortIcon field="discount" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plataforma
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("clicks")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Cliques
                  <SortIcon field="clicks" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("created_at")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Data
                  <SortIcon field="created_at" />
                </button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
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
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Coluna Produto (com imagem e título truncado) */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                        {product.image_url ? (
                          <img src={product.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          getPlatformIcon(product.platform)
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="font-medium text-gray-900 hover:text-purple-600 hover:underline block truncate max-w-[200px] lg:max-w-[300px]"
                          title={product.title}
                        >
                          {product.title}
                        </Link>
                        {product.category && (
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{product.category}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Preço */}
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-semibold text-green-600">
                        R$ {product.discounted_price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 line-through block">
                        R$ {product.original_price.toFixed(2)}
                      </span>
                    </div>
                  </td>

                  {/* Desconto */}
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                      -{product.discount_percentage}%
                    </span>
                  </td>

                  {/* Plataforma */}
                  <td className="px-4 py-3">
                    <span className="text-sm capitalize">
                      {product.platform || "Outra"}
                    </span>
                  </td>

                  {/* Cliques */}
                  <td className="px-4 py-3">
                    <span className="font-medium">{product.clicks_count}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {product.is_active ? "Ativo" : "Inativo"}
                      </span>
                      {product.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium">
                          Destaque
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Data */}
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(product.created_at).toLocaleDateString('pt-BR')}
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-3 text-right">
                    <ProductActions
                      productId={product.id}
                      username={product.profiles?.username || userUsername || ''}
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
    </div>
  )
}
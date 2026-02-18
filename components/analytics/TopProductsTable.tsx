"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface TopProductsTableProps {
  products: Array<{
    id: string
    title: string
    clicks: number
    unique?: Set<string>
  }>
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  const sortedProducts = [...products].sort((a, b) => b.clicks - a.clicks)

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-semibold mb-4">Produtos Mais Clicados</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-500">#</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Produto</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">Cliques</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">Únicos</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 text-sm text-gray-500">#{index + 1}</td>
                <td className="py-3 text-sm font-medium">{product.title}</td>
                <td className="py-3 text-sm text-right">{product.clicks}</td>
                <td className="py-3 text-sm text-right">{product.unique?.size || 0}</td>
                <td className="py-3 text-right">
                  <Link href={`/products/${product.id}/edit`}>
                    <ExternalLink size={16} className="text-gray-400 hover:text-purple-600" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
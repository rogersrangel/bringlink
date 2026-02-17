"use client"

import { useState } from "react"
import { ProductCard } from "./ProductCard"
import { CategoryFilter } from "./CategoryFilter"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"

interface ProductGridProps {
  products: any[]
  username: string
}

export function ProductGrid({ products, username }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")

  // Extrair categorias únicas
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))] as string[]

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "todos" || product.category === selectedCategory
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleTrackClick = (productId: string) => {
    // Aqui vamos implementar o tracking depois
    console.log("Produto clicado:", productId)
  }

  return (
    <div>
      {/* Barra de busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtros */}
      {categories.length > 0 && (
        <CategoryFilter 
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}

      {/* Grid de produtos */}
      {filteredProducts.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory + searchQuery}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard 
                  product={product}
                  onTrackClick={handleTrackClick}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  )
}
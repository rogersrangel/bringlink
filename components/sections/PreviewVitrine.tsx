"use client"

import { motion } from "framer-motion"
import { ProductCard } from "./ProductCard"
import { Avatar, Banner } from "../ui/placeholder"

const produtos = [
  { id: 1, title: "Headset Gamer RGB Wireless", price: 129.90, originalPrice: 189.90, discount: 32, image: "🎧", category: "Áudio" },
  { id: 2, title: "Mouse Sem Fio Logitech Gamer", price: 199.90, originalPrice: 299.90, discount: 33, image: "🖱️", category: "Periféricos" },
  { id: 3, title: "Controle Pro Xbox Series X", price: 399.90, originalPrice: 449.90, discount: 11, image: "🎮", category: "Games" },
  { id: 4, title: "Cadeira Gamer Thunder X3", price: 899.90, originalPrice: 1299.90, discount: 31, image: "🪑", category: "Móveis" },
  { id: 5, title: "Teclado Mecânico RGB Red Switch", price: 329.90, originalPrice: 459.90, discount: 28, image: "⌨️", category: "Periféricos" },
  { id: 6, title: "Headset Razer Kraken X", price: 279.90, originalPrice: 349.90, discount: 20, image: "🎧", category: "Áudio" },
]

export function PreviewVitrine() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {/* Cabeçalho da preview */}
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-purple-600">⚡ PREVIEW</span>
          <h2 className="text-3xl font-bold mt-2">Como fica sua vitrine</h2>
          <p className="text-gray-600 mt-2">Veja um exemplo de como seus produtos aparecem para os seguidores</p>
        </div>

        {/* Perfil do criador mockado */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-2xl">
              👤
            </div>
            <div>
              <h3 className="font-bold text-xl">Ana Gamer</h3>
              <p className="text-gray-500 text-sm">@anagamer • 150k inscritos</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">📺 YouTube</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">📷 Instagram</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">🎵 TikTok</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de produtos */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {produtos.map((produto, index) => (
            <motion.div
              key={produto.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard {...produto} />
            </motion.div>
          ))}
        </motion.div>

        {/* Badge de chamada */}
        <div className="text-center mt-10">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            🚀 +1000 criadores já estão usando
          </span>
        </div>
      </div>
    </section>
  )
}
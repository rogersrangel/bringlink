"use client"

import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
    <motion.div 
      className="text-center py-16 bg-white rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBag size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Nenhum produto ainda
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Este criador ainda não adicionou produtos à vitrine. Volte em breve!
      </p>
      
      <Link href="/">
        <motion.button
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Ver outros criadores
        </motion.button>
      </Link>
    </motion.div>
  )
}
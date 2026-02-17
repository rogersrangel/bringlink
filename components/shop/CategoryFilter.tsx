"use client"

import { motion } from "framer-motion"

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <motion.button
        onClick={() => onSelect("todos")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selected === "todos" 
            ? "bg-purple-600 text-white" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Todos
      </motion.button>
      
      {categories.map((category, index) => (
        <motion.button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === category 
              ? "bg-purple-600 text-white" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  )
}
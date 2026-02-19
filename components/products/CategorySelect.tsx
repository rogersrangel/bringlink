"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"

interface CategorySelectProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
  onAddNew?: (category: string) => void
}

export function CategorySelect({ categories, selected, onSelect, onAddNew }: CategorySelectProps) {
  const [showNew, setShowNew] = useState(false)
  const [newCategory, setNewCategory] = useState("")

  const handleAddNew = () => {
    if (newCategory.trim() && onAddNew) {
      onAddNew(newCategory.trim())
      onSelect(newCategory.trim())
      setNewCategory("")
      setShowNew(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Categoria
      </label>
      
      <div className="flex gap-2">
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          title="Adicionar nova categoria"
        >
          <Plus size={20} className="text-gray-600" />
        </button>
      </div>

      {showNew && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nova categoria"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />
          <button
            onClick={handleAddNew}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Adicionar
          </button>
          <button
            onClick={() => setShowNew(false)}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
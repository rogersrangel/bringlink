"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

interface CategorySelectProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
  onAddNew?: (category: string) => Promise<void>
}

export function CategorySelect({ categories, selected, onSelect, onAddNew }: CategorySelectProps) {
  const [showNew, setShowNew] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddNew = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!newCategory.trim() || !onAddNew) return

    setIsAdding(true)
    try {
      await onAddNew(newCategory.trim())
      onSelect(newCategory.trim())
      setNewCategory("")
      setShowNew(false)
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Categoria</label>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 w-full"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          <span className="sm:hidden">Nova Categoria</span>
        </button>
      </div>

      {showNew && (
        <div className="flex flex-col sm:flex-row gap-2 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nova categoria"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
            autoFocus
            disabled={isAdding}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddNew}
              disabled={isAdding || !newCategory.trim()}
              className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {isAdding ? "..." : "Adicionar"}
            </button>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
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
  const [isAdding, setIsAdding] = useState(false)

  const handleAddNew = async () => {
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
      <label className="block text-sm font-medium text-gray-700">
        Categoria
      </label>
      
      {/* Container flexível que empilha no mobile */}
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
        >
          <option value="">Selecione uma categoria</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          disabled={isAdding}
          className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
          title="Adicionar nova categoria"
        >
          <Plus size={20} className="text-gray-600" />
          <span className="sm:hidden">Nova Categoria</span>
        </button>
      </div>

      {/* Campo de nova categoria - adaptado para mobile */}
      {showNew && (
        <div 
          className="flex flex-col sm:flex-row gap-2 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nova categoria"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            autoFocus
            disabled={isAdding}
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAddNew}
              disabled={isAdding || !newCategory.trim()}
              className="flex-1 sm:flex-none px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isAdding ? "..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              disabled={isAdding}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
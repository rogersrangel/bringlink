"use client"

import { motion } from "framer-motion"
import { Package, ShoppingBag, Eye, TrendingUp } from "lucide-react"

interface ProductActionsProps {
  productId: string
  isActive: boolean
  onToggleStatus: (productId: string) => void
  onDelete: (productId: string) => void
  onDuplicate?: (productId: string) => void
}

export function ProductActions({ 
  productId, 
  isActive, 
  onToggleStatus, 
  onDelete, 
  onDuplicate 
}: ProductActionsProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleStatus = () => {
    setIsLoading(true)
    try {
      onToggleStatus(productId)
      toast.success(isActive ? 'Produto desativado' : 'Produto ativado')
    } catch (error) {
      toast.error('Erro ao alterar status')
    } finally {
      setIsLoading(false)
      setShowMenu(false)
    }
  }

  const handleDelete = () => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return
    
    setIsLoading(true)
    try {
      onDelete(productId)
      toast.success('Produto excluído com sucesso!')
    } catch (error) {
      toast.error('Erro ao excluir produto')
    } finally {
      setIsLoading(false)
      setShowMenu(false)
    }
  }

  const handleDuplicate = () => {
    if (!onDuplicate) return
    
    setIsLoading(true)
    try {
      onDuplicate(productId)
      toast.success('Produto duplicado com sucesso!')
    } catch (error) {
      toast.error('Erro ao duplicar produto')
    } finally {
      setIsLoading(false)
      setShowMenu(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Ver na vitrine */}
      <Link href={`/shop/${productId}`} target="_blank">
        <motion.button
          className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Ver na vitrine"
          disabled={isLoading}
        >
          <Eye size={16} />
        </motion.button>
      </Link>

      {/* Editar */}
      <Link href={`/products/${productId}/edit`}>
        <motion.button
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Editar"
          disabled={isLoading}
        >
          <Edit size={16} />
        </motion.button>
      </Link>

      {/* Ativar/Desativar */}
      <motion.button
        onClick={handleToggleStatus}
        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
          isActive 
            ? "text-green-600 hover:bg-green-50" 
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isActive ? "Desativar" : "Ativar"}
        disabled={isLoading}
      >
        <Power size={16} />
      </motion.button>

      {/* Menu com mais opções */}
      <div className="relative">
        <motion.button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          <MoreHorizontal size={16} />
        </motion.button>

        {showMenu && (
          <motion.div
            className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {onDuplicate && (
              <button
                onClick={handleDuplicate}
                disabled={isLoading}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
              >
                <Copy size={14} />
                Duplicar
              </button>
            )}
            
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 size={14} />
              Excluir
            </button>
          </motion.div>
        )}
      </div>

      {isLoading && (
        <span className="text-xs text-gray-400">...</span>
      )}
    </div>
  )
}
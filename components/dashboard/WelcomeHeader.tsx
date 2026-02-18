"use client"

import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"
import { LogOut, Settings, Package, BarChart3 } from "lucide-react" // ← LINHA 5: Adicione BarChart3
import Link from "next/link"

interface WelcomeHeaderProps {
  todayClicks?: number // ← LINHA 9: Adicione esta prop
}

export function WelcomeHeader({ todayClicks }: WelcomeHeaderProps) { // ← LINHA 11: Adicione todayClicks
  const { user, signOut } = useAuth()
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="flex items-center gap-4"> {/* ← LINHA 25: Adicione flex items-center */}
        <div> {/* ← LINHA 26: Envolva o título em uma div */}
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Aqui está o desempenho dos seus links hoje
          </p>
        </div>
        
        {/* 🔥 NOVO: Badge de cliques hoje (linhas 37-44) */}
        {todayClicks !== undefined && (
          <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
            <span className="text-lg">🎯</span>
            <span className="font-semibold">{todayClicks}</span>
            <span className="text-sm">cliques hoje</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Link href="/products">
          <motion.button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Package size={18} />
            <span className="hidden sm:inline">Meus Produtos</span>
          </motion.button>
        </Link>

        <Link href="/analytics?period=7d"> {/* ← LINHA 63: Adicione este botão */}
          <motion.button
            className="p-2 text-gray-600 hover:text-purple-600 bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Ver Analytics"
          >
            <BarChart3 size={20} />
          </motion.button>
        </Link>

        <Link href="/settings">
          <motion.button
            className="p-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={20} />
          </motion.button>
        </Link>
        
        <motion.button
          onClick={signOut}
          className="p-2 text-gray-600 hover:text-red-600 bg-white rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={20} />
        </motion.button>
      </div>
    </div>
  )
}
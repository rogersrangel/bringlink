"use client"

import { useAuth } from "@/hooks/useAuth"
import { motion } from "framer-motion"
import { LogOut, Settings, Package } from "lucide-react" // ← ADICIONE Package
import Link from "next/link"

export function WelcomeHeader() {
  const { user, signOut } = useAuth()
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Aqui está o desempenho dos seus links hoje
        </p>
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
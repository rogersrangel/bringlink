"use client"

import { motion } from "framer-motion"
import { Chrome } from "lucide-react"

interface GoogleButtonProps {
  onClick?: () => void
}

export function GoogleButton({ onClick }: GoogleButtonProps) {
  return (
    <motion.button
      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <Chrome size={20} />
      Continuar com Google
    </motion.button>
  )
}
"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  name: string
  username: string
  avatar: string
  text: string
  rating: number
  subscribers: string
}

export function TestimonialCard({ name, username, avatar, text, rating, subscribers }: TestimonialCardProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full"
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Avaliação em estrelas */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={18} 
            className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>

      {/* Depoimento */}
      <p className="text-gray-700 mb-6 line-clamp-4">"{text}"</p>

      {/* Perfil do usuário */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xl">
          {avatar}
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{username} • {subscribers} inscritos</p>
        </div>
      </div>
    </motion.div>
  )
}
"use client"

import { motion } from "framer-motion"
import { Package, ShoppingBag, Eye, TrendingUp } from "lucide-react"

interface ProductStatsProps {
  totalProducts: number
  activeProducts: number
  totalClicks: number
  featuredProducts: number
}

export function ProductStats({
  totalProducts,
  activeProducts,
  totalClicks,
  featuredProducts
}: ProductStatsProps) {
  const stats = [
    {
      title: "Total de Produtos",
      value: totalProducts,
      icon: Package,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Produtos Ativos",
      value: activeProducts,
      icon: ShoppingBag,
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Total de Cliques",
      value: totalClicks,
      icon: Eye,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Em Destaque",
      value: featuredProducts,
      icon: TrendingUp,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
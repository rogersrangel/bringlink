"use client"

import { motion } from "framer-motion"
import { MousePointerClick, Eye, ShoppingBag, TrendingUp } from "lucide-react"
import Link from "next/link"


interface StatsCardsProps {
  stats: {
    totalClicks: number
    totalProducts: number
    todayClicks: number
    conversionRate: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Cliques Totais",
      value: stats.totalClicks,
      icon: MousePointerClick,
      change: "+12%",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Hoje",
      value: stats.todayClicks,
      icon: TrendingUp,
      change: "+5%",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Produtos",
      value: stats.totalProducts,
      icon: ShoppingBag,
      change: "10 ativos",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Conversão",
      value: `${stats.conversionRate}%`,
      icon: Eye,
      change: "+2.5%",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        
        return (
          <Link href={`/analytics?period=7d&metric=${card.title.toLowerCase()}`}>

          <motion.div
            key={card.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-5 h-5 text-${card.color.split('-')[1]}-600`} />
              </div>
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {card.change}
              </span>
            </div>
            
            <h3 className="text-gray-500 text-sm mb-1">{card.title}</h3>
            <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
          </motion.div>
          </Link>

        )
      })}
    </div>
  )
}
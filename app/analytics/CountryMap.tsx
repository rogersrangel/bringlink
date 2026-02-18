"use client"

import { motion } from "framer-motion"
import { WorldMap } from "@/components/ui/world-map" // Você pode usar uma lib como react-simple-maps

interface CountryData {
  country: string
  clicks: number
  unique: Set<string>
}

interface CountryMapProps {
  data: CountryData[]
}

export function CountryMap({ data }: CountryMapProps) {
  const totalClicks = data.reduce((acc, d) => acc + d.clicks, 0)

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-semibold mb-4">Cliques por País</h2>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {data
          .sort((a, b) => b.clicks - a.clicks)
          .map((country, index) => {
            const percentage = ((country.clicks / totalClicks) * 100).toFixed(1)
            
            return (
              <div key={country.country} className="flex items-center gap-3">
                <span className="text-sm w-8 text-gray-500">#{index + 1}</span>
                <span className="text-sm font-medium w-32 truncate">
                  {country.country}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-16 text-right">
                  {country.clicks}
                </span>
                <span className="text-xs text-gray-400 w-16">
                  ({country.unique.size} únicos)
                </span>
              </div>
            )
          })}
      </div>

      {data.length === 0 && (
        <p className="text-center text-gray-400 py-8">
          Nenhum clique registrado neste período
        </p>
      )}
    </motion.div>
  )
}
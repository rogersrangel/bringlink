"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

interface ChartData {
  date: string
  clicks: number
}

export function ClicksChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d")

  // Dados mockados para exemplo
  useEffect(() => {
    const mockData = [
      { date: "10/02", clicks: 45 },
      { date: "11/02", clicks: 52 },
      { date: "12/02", clicks: 38 },
      { date: "13/02", clicks: 65 },
      { date: "14/02", clicks: 58 },
      { date: "15/02", clicks: 72 },
      { date: "16/02", clicks: 89 }
    ]
    setData(mockData)
  }, [period])

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Cliques ao longo do tempo</h2>
        
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                period === p 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#8b5cf6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
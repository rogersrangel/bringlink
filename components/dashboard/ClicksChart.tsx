"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

interface ChartData {
  date: string
  clicks: number
}

interface ClicksChartProps {
  initialData: ChartData[]
}

export function ClicksChart({ initialData }: ClicksChartProps) {
  const [data, setData] = useState<ChartData[]>(initialData || [])
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d")

  // Este useEffect só deve ser ativado se você realmente quiser buscar mais dados
  useEffect(() => {
    // Se você tiver uma função para buscar dados de 30/90 dias, chame-a aqui
    // Por enquanto, vamos manter os dados iniciais
    if (period === '7d') {
      setData(initialData || [])
    } else {
      // Aqui você futuramente buscará dados de 30/90 dias
      console.log(`Buscar dados para período ${period}`)
    }
  }, [period, initialData])

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
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
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
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Nenhum clique registrado ainda
          </div>
        )}
      </div>
    </motion.div>
  )
}
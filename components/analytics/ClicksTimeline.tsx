"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

interface ClicksTimelineProps {
  clicks: Array<{
    clicked_at: string
  }>
}

export function ClicksTimeline({ clicks }: ClicksTimelineProps) {
  // Agrupar cliques por dia
  const clicksByDay = clicks.reduce((acc: any, click) => {
    const day = new Date(click.clicked_at).toLocaleDateString('pt-BR')
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(clicksByDay).map(([date, count]) => ({
    date,
    clicks: count
  }))

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-semibold mb-4">Evolução dos Cliques</h2>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: "#8b5cf6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
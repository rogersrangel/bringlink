"use client"

import { motion } from "framer-motion"
import { Smartphone, Tablet, Monitor, HelpCircle } from "lucide-react"

interface DevicesChartProps {
  data: Record<string, number>
}

export function DevicesChart({ data }: DevicesChartProps) {
  const total = Object.values(data).reduce((acc, val) => acc + val, 0)
  
  const devices = [
    { key: 'mobile', label: 'Mobile', icon: Smartphone, color: 'bg-purple-600' },
    { key: 'tablet', label: 'Tablet', icon: Tablet, color: 'bg-blue-600' },
    { key: 'desktop', label: 'Desktop', icon: Monitor, color: 'bg-green-600' },
    { key: 'unknown', label: 'Desconhecido', icon: HelpCircle, color: 'bg-gray-600' }
  ]

  return (
    <motion.div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h2 className="text-lg font-semibold mb-4">Dispositivos</h2>

      <div className="space-y-4">
        {devices.map((device) => {
          const count = data[device.key] || 0
          const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0
          const Icon = device.icon

          return (
            <div key={device.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-gray-500" />
                  <span className="text-sm">{device.label}</span>
                </div>
                <span className="text-sm font-medium">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${device.color} rounded-full transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {total === 0 && (
        <p className="text-center text-gray-400 py-4">
          Nenhum dado disponível
        </p>
      )}
    </motion.div>
  )
}
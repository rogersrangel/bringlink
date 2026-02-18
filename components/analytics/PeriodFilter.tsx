"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Calendar } from "lucide-react"

interface PeriodFilterProps {
  currentPeriod: string
}

export function PeriodFilter({ currentPeriod }: PeriodFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const periods = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' }
  ]

  const handlePeriodChange = (period: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', period)
    router.push(`/analytics?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-3">
      <Calendar size={18} className="text-gray-500" />
      <select
        value={currentPeriod}
        onChange={(e) => handlePeriodChange(e.target.value)}
        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {periods.map(period => (
          <option key={period.value} value={period.value}>
            {period.label}
          </option>
        ))}
      </select>
    </div>
  )
}
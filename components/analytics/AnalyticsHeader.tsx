"use client"

import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { useRouter } from "next/navigation"

interface AnalyticsHeaderProps {
  onExport?: () => void
}

export function AnalyticsHeader({ onExport }: AnalyticsHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Estatísticas Detalhadas</h1>
          <p className="text-gray-600 text-sm">
            Análise completa dos seus cliques
          </p>
        </div>
      </div>

      {onExport && (
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download size={18} />
          Exportar Relatório
        </button>
      )}
    </div>
  )
}
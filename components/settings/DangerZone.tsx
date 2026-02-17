"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
      <div className="flex items-center gap-2 text-red-600 mb-4">
        <AlertTriangle size={20} />
        <h3 className="text-lg font-medium">Zona de Perigo</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Ações irreversíveis. Tenha cuidado!
      </p>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Desativar conta
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-red-600">
            Tem certeza? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Sim, desativar
            </button>
            <button 
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
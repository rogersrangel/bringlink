"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"

interface PlanCardProps {
  name: string
  price: string
  period: string
  description: string
  features: { name: string; included: boolean }[]
  cta: string
  popular?: boolean
  color: string
}

export function PlanCard({ name, price, period, description, features, cta, popular, color }: PlanCardProps) {
  return (
    <motion.div
      className={`relative bg-white rounded-2xl shadow-lg border overflow-hidden h-full ${
        popular ? 'border-purple-500 shadow-xl scale-105 md:scale-110 z-10' : 'border-gray-200'
      }`}
      whileHover={{ y: popular ? -8 : -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Badge "Mais Popular" */}
      {popular && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
          🔥 Mais Popular
        </div>
      )}

      {/* Cabeçalho com cor gradiente */}
      <div className={`h-2 bg-gradient-to-r ${color}`} />

      <div className="p-6">
        {/* Nome do plano */}
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className="text-gray-500 text-sm mb-4">{description}</p>

        {/* Preço */}
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-gray-500 ml-2">{period}</span>
        </div>

        {/* Lista de features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              {feature.included ? (
                <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
              ) : (
                <X size={18} className="text-red-400 shrink-0 mt-0.5" />
              )}
              <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>

        {/* Botão CTA */}
        <Button 
          className={`w-full ${
            popular 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
              : ''
          }`}
          variant={popular ? 'default' : 'outline'}
          size="lg"
          asChild
        >
          <Link href="/register">{cta}</Link>
        </Button>
      </div>
    </motion.div>
  )
}
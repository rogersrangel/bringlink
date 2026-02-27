'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { CheckoutButton } from './CheckoutButton'
import { Plan } from '@/lib/pricing'

interface PlanCardProps {
  plan: Plan
  currentPlanId?: string
  isYearly: boolean
  onToggleYearly: () => void
}

export function PlanCard({ plan, currentPlanId, isYearly, onToggleYearly }: PlanCardProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    isYearly ? 'yearly' : 'monthly'
  )

  const handleToggle = () => {
    const newPeriod = billingPeriod === 'monthly' ? 'yearly' : 'monthly'
    setBillingPeriod(newPeriod)
    onToggleYearly()
  }

  const price = billingPeriod === 'monthly' 
    ? plan.price.monthly 
    : plan.price.yearly

  const isFree = price === 0
  const isCurrentPlan = currentPlanId === plan.id

  return (
    <motion.div
      className={`relative bg-white rounded-2xl shadow-lg border overflow-hidden ${
        plan.isPopular ? 'border-purple-500 shadow-xl scale-105 z-10' : 'border-gray-200'
      }`}
      whileHover={{ y: plan.isPopular ? -8 : -4 }}
    >
      {plan.isPopular && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
          🔥 Mais Popular
        </div>
      )}

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

        <div className="mb-6">
          {isFree ? (
            <span className="text-4xl font-bold">Grátis</span>
          ) : (
            <>
              <span className="text-4xl font-bold">
                R$ {price?.toFixed(2)}
              </span>
              <span className="text-gray-500 ml-2">
                /{billingPeriod === 'monthly' ? 'mês' : 'ano'}
              </span>
            </>
          )}
        </div>

        {!isFree && (
          <div className="mb-6">
            <button
              onClick={handleToggle}
              className="flex items-center bg-gray-100 p-1 rounded-full w-fit"
            >
              <div className={`px-4 py-1 rounded-full text-sm transition-colors ${
                billingPeriod === 'monthly' ? 'bg-purple-600 text-white' : 'text-gray-600'
              }`}>
                Mensal
              </div>
              <div className={`px-4 py-1 rounded-full text-sm transition-colors ${
                billingPeriod === 'yearly' ? 'bg-purple-600 text-white' : 'text-gray-600'
              }`}>
                Anual
              </div>
            </button>
          </div>
        )}

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {isCurrentPlan ? (
          <button
            disabled
            className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg cursor-default"
          >
            Plano Atual
          </button>
        ) : isFree ? (
          <button
            onClick={() => window.location.href = '/register'}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90"
          >
            Começar Grátis
          </button>
        ) : (
          <CheckoutButton
            planId={plan.id}
            billingPeriod={billingPeriod}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
          >
            Assinar Agora
          </CheckoutButton>
        )}
      </div>
    </motion.div>
  )
}
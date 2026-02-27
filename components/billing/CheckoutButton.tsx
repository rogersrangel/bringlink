'use client'

import { useState } from 'react'
import { createCheckoutSession } from '@/app/actions/stripe'
import { Loader2 } from 'lucide-react'

interface CheckoutButtonProps {
  planId: string
  billingPeriod: 'monthly' | 'yearly'
  children: React.ReactNode
  className?: string
}

export function CheckoutButton({ 
  planId, 
  billingPeriod, 
  children, 
  className = '' 
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    try {
      setIsLoading(true)
      await createCheckoutSession(planId, billingPeriod)
    } catch (error) {
      console.error('Erro no checkout:', error)
      alert('Erro ao iniciar checkout. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin mr-2" />
          Processando...
        </>
      ) : children}
    </button>
  )
}
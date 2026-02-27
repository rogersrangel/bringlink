export type PlanId = 'free' | 'pro' | 'business'

export interface Plan {
  id: PlanId
  name: string
  description: string
  price: {
    monthly: number | null
    yearly: number | null
    monthlyPriceId?: string
    yearlyPriceId?: string
  }
  features: string[]
  limits: {
    products: number // -1 = ilimitado
    analyticsDays: number // 7, 30, 365, -1 = ilimitado
    customDomain: boolean
    api: boolean
    teamMembers: number
  }
  isPopular?: boolean
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Para começar',
    price: {
      monthly: 0,
      yearly: null,
    },
    features: [
      'Até 10 produtos',
      'Analytics dos últimos 7 dias',
      'Links encurtados com Bitly',
      'Suporte por email (72h)',
    ],
    limits: {
      products: 10,
      analyticsDays: 7,
      customDomain: false,
      api: false,
      teamMembers: 1,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'Para criadores profissionais',
    price: {
      monthly: 29.90,
      yearly: 299.90,
      monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
      yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
    },
    features: [
      'Produtos ilimitados',
      'Analytics completo + histórico',
      'Links personalizados',
      'Suporte prioritário (chat)',
      'Exportação de relatórios',
      'Remoção da marca BringLink',
    ],
    limits: {
      products: -1,
      analyticsDays: -1,
      customDomain: true,
      api: false,
      teamMembers: 1,
    },
    isPopular: true,
  },
  business: {
    id: 'business',
    name: 'Business',
    description: 'Para agências e times',
    price: {
      monthly: 99.90,
      yearly: 999.90,
      monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID,
      yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID,
    },
    features: [
      'Tudo do Pro',
      '5 usuários na equipe',
      'API dedicada',
      'Onboarding VIP',
      'SLA garantido',
      'Gerente de sucesso',
    ],
    limits: {
      products: -1,
      analyticsDays: -1,
      customDomain: true,
      api: true,
      teamMembers: 5,
    },
  },
}

// Helper para verificar limites
export function checkPlanLimit(
  userPlan: PlanId,
  limitKey: keyof Plan['limits'],
  currentValue: number
): boolean {
  const limit = PLANS[userPlan].limits[limitKey]
  if (limit === -1) return true // Ilimitado
  return currentValue <= limit
}
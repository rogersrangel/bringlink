import { useAuth } from './useAuth'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { PLANS, checkPlanLimit, PlanId } from '@/lib/pricing'

export function usePlanLimits() {
  const { user } = useAuth()
  const [plan, setPlan] = useState<PlanId>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchPlan = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('plan_type')
        .eq('id', user.id)
        .single()

      setPlan((data?.plan_type as PlanId) || 'free')
      setLoading(false)
    }

    fetchPlan()
  }, [user])

  const canAddProduct = async (currentProducts: number) => {
    return checkPlanLimit(plan, 'products', currentProducts)
  }

  const canAccessAnalytics = (days: number) => {
    const limit = PLANS[plan].limits.analyticsDays
    return limit === -1 || days <= limit
  }

  const getLimit = (key: keyof typeof PLANS.free.limits) => {
    return PLANS[plan].limits[key]
  }

  return {
    plan,
    loading,
    canAddProduct,
    canAccessAnalytics,
    getLimit,
    limits: PLANS[plan].limits,
    features: PLANS[plan].features,
  }
}
'use server'

import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PLANS } from '@/lib/pricing'

export async function createCheckoutSession(planId: string, billingPeriod: 'monthly' | 'yearly') {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    const plan = PLANS[planId as keyof typeof PLANS]
    if (!plan) throw new Error('Plano inválido')

    const priceId = billingPeriod === 'monthly' 
      ? plan.price.monthlyPriceId 
      : plan.price.yearlyPriceId

    if (!priceId) throw new Error('Price ID não configurado')

    // Buscar ou criar customer no Stripe
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan_id: planId,
        billing_period: billingPeriod,
      },
      allow_promotion_codes: true,
    })

    if (!session.url) throw new Error('Erro ao criar sessão')
    redirect(session.url)
  } catch (error) {
    console.error('Erro no checkout:', error)
    throw new Error('Erro ao processar checkout')
  }
}

export async function createPortalSession() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      throw new Error('Usuário não possui customer_id')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    })

    redirect(session.url)
  } catch (error) {
    console.error('Erro ao criar portal:', error)
    throw new Error('Erro ao abrir portal de gerenciamento')
  }
}
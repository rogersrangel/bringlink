import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`✅ Webhook recebido: ${event.type}`)

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        const planId = session.metadata?.plan_id

        if (userId && planId) {
          await supabase
            .from('profiles')
            .update({
              plan_type: planId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
          console.log(`✅ Plano atualizado para usuário ${userId}: ${planId}`)
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id

        if (userId) {
          const planType = subscription.items.data[0]?.price.product === process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID?.split('_')[1]
            ? 'pro' : 'business'

          await supabase
            .from('profiles')
            .update({
              plan_type: planType,
              plan_expires_at: subscription.current_period_end 
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
          console.log(`✅ Assinatura atualizada para usuário ${userId}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id

        if (userId) {
          await supabase
            .from('profiles')
            .update({
              plan_type: 'free',
              plan_expires_at: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
          console.log(`✅ Assinatura cancelada para usuário ${userId}`)
        }
        break
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('❌ Webhook handler failed:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
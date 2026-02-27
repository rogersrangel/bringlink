import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/pricing'
import { PlanCard } from '@/components/billing/PlanCard'
import { createPortalSession } from '@/app/actions/stripe'

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let currentPlanId = 'free'

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan_type')
      .eq('id', user.id)
      .single()

    currentPlanId = profile?.plan_type || 'free'
  }

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Escolha o plano ideal para você</h1>
          <p className="text-xl text-gray-600">
            Comece grátis e faça upgrade quando precisar de mais recursos
          </p>

          {user && currentPlanId !== 'free' && (
            <form action={createPortalSession} className="mt-4">
              <button
                type="submit"
                className="text-purple-600 hover:text-purple-700 underline"
              >
                Gerenciar assinatura atual
              </button>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {Object.values(PLANS).map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlanId={currentPlanId}
              isYearly={false}
              onToggleYearly={() => {}}
            />
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Comparação de Recursos</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4">Recurso</th>
                  <th className="text-center py-4">Free</th>
                  <th className="text-center py-4">Pro</th>
                  <th className="text-center py-4">Business</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4">Produtos</td>
                  <td className="text-center">10</td>
                  <td className="text-center">∞</td>
                  <td className="text-center">∞</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4">Analytics</td>
                  <td className="text-center">7 dias</td>
                  <td className="text-center">Completo</td>
                  <td className="text-center">Completo</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4">Domínio próprio</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅</td>
                  <td className="text-center">✅</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4">Membros da equipe</td>
                  <td className="text-center">1</td>
                  <td className="text-center">1</td>
                  <td className="text-center">5</td>
                </tr>
                <tr>
                  <td className="py-4">API</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader"
import { CountryMap } from "@/components/analytics/CountryMap"
import { DevicesChart } from "@/components/analytics/DevicesChart"
import { ClicksTimeline } from "@/components/analytics/ClicksTimeline"
import { TopProductsTable } from "@/components/analytics/TopProductsTable"
import { PeriodFilter } from "@/components/analytics/PeriodFilter"

export default async function AnalyticsPage({
  searchParams
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { period } = await searchParams
  
  const periodDays = period === '30d' ? 30 : period === '90d' ? 90 : 7

  if (!user) {
    redirect("/login")
  }

  // Buscar dados do período selecionado
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - periodDays)

  const { data: clicks } = await supabase
    .from('clicks')
    .select(`
      *,
      products (
        id,
        title,
        clicks_count
      )
    `)
    .eq('user_id', user.id)
    .gte('clicked_at', startDate.toISOString())
    .order('clicked_at', { ascending: false })

  // Estatísticas por país
  const countryStats = clicks?.reduce((acc: any, click) => {
    const country = click.country || 'Desconhecido'
    if (!acc[country]) {
      acc[country] = { country, clicks: 0, unique: new Set() }
    }
    acc[country].clicks++
    acc[country].unique.add(click.ip_address)
    return acc
  }, {})

  // Estatísticas por dispositivo
  const deviceStats = clicks?.reduce((acc: any, click) => {
    const device = click.device_type || 'desconhecido'
    acc[device] = (acc[device] || 0) + 1
    return acc
  }, {})

  // Top produtos
  const productStats = clicks?.reduce((acc: any, click) => {
    const productId = click.product_id
    if (!acc[productId]) {
      acc[productId] = {
        id: productId,
        title: click.products?.title || 'Produto removido',
        clicks: 0,
        unique: new Set()
      }
    }
    acc[productId].clicks++
    acc[productId].unique.add(click.ip_address)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <AnalyticsHeader />
        <PeriodFilter currentPeriod={period || '7d'} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <CountryMap data={Object.values(countryStats || {})} />
          </div>
          <div>
            <DevicesChart data={deviceStats || {}} />
          </div>
        </div>

        <div className="mt-6">
          <ClicksTimeline clicks={clicks || []} />
        </div>

        <div className="mt-6">
          <TopProductsTable products={Object.values(productStats || {})} />
        </div>
      </div>
    </div>
  )
}
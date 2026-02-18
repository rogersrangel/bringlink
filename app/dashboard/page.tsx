import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { ClicksChart } from "@/components/dashboard/ClicksChart"
import { TopProducts } from "@/components/dashboard/TopProducts"
import { RecentProducts } from "@/components/dashboard/RecentProducts"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Buscar produtos do usuário
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)

  // Buscar cliques dos últimos 7 dias
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentClicks } = await supabase
    .from('clicks')
    .select('*')
    .eq('user_id', user.id)
    .gte('clicked_at', sevenDaysAgo.toISOString())
    .order('clicked_at', { ascending: false })

  // Calcular cliques de hoje
  const today = new Date().toISOString().split('T')[0]
  const todayClicks = recentClicks?.filter(click => 
    click.clicked_at.startsWith(today)
  ).length || 0

  // Calcular total de cliques
  const totalClicks = products?.reduce((acc, p) => acc + (p.clicks_count || 0), 0) || 0

  // Estatísticas
  const stats = {
    totalClicks,
    totalProducts: products?.length || 0,
    todayClicks,
    conversionRate: products && products.length > 0 
      ? Number(((totalClicks / (products.length * 100)) * 100).toFixed(1))
      : 0
  }

  // Preparar dados para o gráfico (últimos 7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const chartData = last7Days.map(date => {
    const clicks = recentClicks?.filter(click => 
      click.clicked_at.startsWith(date)
    ).length || 0
    return { 
      date: date.split('-')[2] + '/' + date.split('-')[1], 
      clicks 
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <WelcomeHeader />
        <StatsCards stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <ClicksChart initialData={chartData} />
          </div>
          <div>
            <TopProducts products={products || []} />
          </div>
        </div>
        
        <div className="mt-6">
          <RecentProducts products={products || []} />
        </div>
      </div>
    </div>
  )
}
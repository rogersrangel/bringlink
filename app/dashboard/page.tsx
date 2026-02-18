import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { ClicksChart } from "@/components/dashboard/ClicksChart"
import { TopProducts } from "@/components/dashboard/TopProducts"
import { RecentProducts } from "@/components/dashboard/RecentProducts"
import Link from "next/link" // ← ADICIONE ESTA LINHA (linha 7)

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

  // 🔥 NOVO: Estatísticas por país (linhas 69-79)
  const countryStats = recentClicks?.reduce((acc: any, click) => {
    const country = click.country || 'Desconhecido'
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <WelcomeHeader todayClicks={stats.todayClicks} />
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <ClicksChart initialData={chartData} />
          </div>

          <div>
            <TopProducts products={products || []} />
          </div>
        </div>

        {/* 🔥 NOVA SEÇÃO: Top Países e Dispositivos (linhas 96-156) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Países */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              Top Países
            </h3>

            <div className="space-y-3">
              {countryStats && Object.entries(countryStats)
                .sort((a: any, b: any) => b[1] - a[1])
                .slice(0, 5)
                .map(([country, count]: [string, any]) => (
                  <div key={country} className="flex justify-between items-center">
                    <span className="text-gray-700">{country}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-gray-400">
                        ({Math.round((count / (recentClicks?.length || 1)) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))
              }
              {(!countryStats || Object.keys(countryStats).length === 0) && (
                <p className="text-gray-400 text-center py-4">
                  Nenhum clique registrado ainda
                </p>
              )}
            </div>

            <Link
              href="/analytics?period=7d"
              className="text-sm text-purple-600 hover:text-purple-700 mt-4 inline-block"
            >
              Ver todos os países →
            </Link>
          </div>

          {/* Dispositivos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">📱</span>
              Dispositivos
            </h3>

            <div className="space-y-3">
              {['mobile', 'desktop', 'tablet', 'unknown'].map(device => {
                const count = recentClicks?.filter(c => c.device_type === device).length || 0
                if (count === 0 && device !== 'unknown') return null

                const icons = {
                  mobile: '📱',
                  desktop: '💻',
                  tablet: '📟',
                  unknown: '❓'
                }

                const labels = {
                  mobile: 'Mobile',
                  desktop: 'Desktop',
                  tablet: 'Tablet',
                  unknown: 'Desconhecido'
                }

                return (
                  <div key={device} className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span>{icons[device as keyof typeof icons]}</span>
                      <span className="text-gray-700">{labels[device as keyof typeof labels]}</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-gray-400">
                        ({Math.round((count / (recentClicks?.length || 1)) * 100)}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <Link
              href="/analytics?period=7d#dispositivos"
              className="text-sm text-purple-600 hover:text-purple-700 mt-4 inline-block"
            >
              Ver detalhes →
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <RecentProducts products={products || []} />
        </div>
      </div>
    </div>
  )
}
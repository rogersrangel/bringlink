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

  // Buscar dados reais do banco
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)

  const stats = {
    totalClicks: products?.reduce((acc, p) => acc + (p.clicks_count || 0), 0) || 0,
    totalProducts: products?.length || 0,
    todayClicks: 89, // Depois implementar cliques de hoje
    conversionRate: 3.2
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <WelcomeHeader />
        <StatsCards stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <ClicksChart />
          </div>
          <div>
            <TopProducts />
          </div>
        </div>
        
        <div className="mt-6">
          <RecentProducts />
        </div>
      </div>
    </div>
  )
}
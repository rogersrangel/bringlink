import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProfileHeader } from "@/components/shop/ProfileHeader"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { ShareButtons } from "@/components/shop/ShareButtons"
import { EmptyState } from "@/components/shop/EmptyState"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ShopPageProps {
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  try {
    const { username } = await params
    
    if (!username) {
      return {
        title: 'Vitrine - BringLink',
        description: 'Confira produtos recomendados',
      }
    }
    
    const supabase = await createClient()
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, bio')
      .eq('username', username)
      .single()

    return {
      title: `${profile?.display_name || username} - BringLink Shop`,
      description: profile?.bio || `Confira os produtos recomendados por ${username}`,
    }
  } catch (error) {
    return {
      title: 'Vitrine - BringLink',
      description: 'Confira produtos recomendados',
    }
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  try {
    const { username } = await params
    
    if (!username) {
      notFound()
    }

    const supabase = await createClient()

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (profileError || !profile) {
      notFound()
    }

    // Verificar se o usuário logado é o dono da vitrine
    const { data: { user } } = await supabase.auth.getUser()
    const isOwnProfile = user?.id === profile.id

    // Buscar produtos do usuário (apenas ativos)
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    // URL da página para compartilhamento
    const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop/${username}`

    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* 🔥 BOTÃO VOLTAR (só aparece para o dono da vitrine) */}
          {isOwnProfile && (
            <div className="mb-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm"
              >
                <ArrowLeft size={18} />
                Voltar ao Dashboard
              </Link>
            </div>
          )}

          {/* Header da vitrine */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-semibold text-purple-600">VITRINE</h2>
              <p className="text-gray-500 text-sm">Produtos recomendados por</p>
            </div>
            
            <ShareButtons 
              url={pageUrl}
              title={`Confira os produtos que ${profile.display_name} recomenda!`}
            />
          </div>

          {/* Perfil */}
          <ProfileHeader profile={profile} />

          {/* Produtos */}
          {products && products.length > 0 ? (
            <ProductGrid products={products} username={username} />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error('Erro na ShopPage:', error)
    notFound()
  }
}
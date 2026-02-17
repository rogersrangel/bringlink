import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProfileHeader } from "@/components/shop/ProfileHeader"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { ShareButtons } from "@/components/shop/ShareButtons"
import { EmptyState } from "@/components/shop/EmptyState"
import { Metadata } from "next"

interface ShopPageProps {
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    
    // VERIFICAÇÃO: se não tiver params, retorna metadata genérica
    if (!resolvedParams || !resolvedParams.username) {
      return {
        title: 'Vitrine - BringLink',
        description: 'Confira produtos recomendados',
      }
    }

    const username = resolvedParams.username
    // Só faz replace se for string e tiver @
    const cleanUsername = typeof username === 'string' 
      ? username.replace('@', '') 
      : String(username)
    
    const supabase = await createClient()
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, bio')
      .eq('username', cleanUsername)
      .single()

    return {
      title: `${profile?.display_name || cleanUsername} - BringLink Shop`,
      description: profile?.bio || `Confira os produtos recomendados por ${cleanUsername}`,
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
    const resolvedParams = await params
    
    // VERIFICAÇÃO CRÍTICA: se não tiver username, vai para 404
    if (!resolvedParams || !resolvedParams.username) {
      console.error('ShopPage: username não fornecido na URL')
      notFound()
    }

    const username = resolvedParams.username
    // Só faz replace se for string e tiver @
    const cleanUsername = typeof username === 'string' 
      ? username.replace('@', '') 
      : String(username)
    
    const supabase = await createClient()

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', cleanUsername)
      .single()

    if (profileError || !profile) {
      console.error('ShopPage: perfil não encontrado', cleanUsername)
      notFound()
    }

    // Buscar produtos do usuário (apenas ativos)
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    // URL da página para compartilhamento (SEM @ na URL)
    const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop/${cleanUsername}`

    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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
            <ProductGrid products={products} username={cleanUsername} />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error('ShopPage: erro inesperado', error)
    notFound()
  }
}
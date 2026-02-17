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
  // Segurança máxima: se algo der errado, retorna metadata padrão
  try {
    const resolvedParams = await params
    
    // Se não tiver params, retorna padrão
    if (!resolvedParams) {
      return {
        title: 'Vitrine - BringLink',
        description: 'Confira produtos recomendados',
      }
    }

    const username = resolvedParams.username
    
    // Se não tiver username, retorna padrão
    if (!username) {
      return {
        title: 'Vitrine - BringLink',
        description: 'Confira produtos recomendados',
      }
    }

    // Remove @ se existir (de forma segura)
    const cleanUsername = typeof username === 'string' ? username.replace('@', '') : username
    
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
    // Se qualquer erro ocorrer, retorna metadata padrão
    return {
      title: 'Vitrine - BringLink',
      description: 'Confira produtos recomendados',
    }
  }
}

export default async function ShopPage({ params }: ShopPageProps) {
  // Segurança máxima: try/catch em todo o componente
  try {
    // 1. Verificar se params existe
    if (!params) {
      console.error('ShopPage: params é undefined')
      notFound()
    }

    // 2. Resolver params
    const resolvedParams = await params
    
    if (!resolvedParams) {
      console.error('ShopPage: resolvedParams é undefined')
      notFound()
    }

    // 3. Verificar se username existe
    const username = resolvedParams.username
    
    if (!username) {
      console.error('ShopPage: username é undefined')
      notFound()
    }

    // 4. Garantir que username é string antes de usar replace
    const cleanUsername = typeof username === 'string' 
      ? username.replace('@', '') 
      : String(username)

    console.log('ShopPage: buscando perfil para', cleanUsername)

    // 5. Buscar perfil
    const supabase = await createClient()

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', cleanUsername)
      .single()

    if (profileError || !profile) {
      console.error('ShopPage: perfil não encontrado', cleanUsername)
      notFound()
    }

    // 6. Buscar produtos
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    // 7. URL para compartilhamento
    const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop/${cleanUsername}`

    // 8. Renderizar
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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

          <ProfileHeader profile={profile} />

          {products && products.length > 0 ? (
            <ProductGrid products={products} username={cleanUsername} />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    )
  } catch (error) {
    // Se qualquer erro acontecer, mostra 404
    console.error('ShopPage: erro inesperado', error)
    notFound()
  }
}
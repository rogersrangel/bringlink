import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductStats } from "@/components/products/ProductStats"
import { ProductFilters } from "@/components/products/ProductFilters"
import { ProductTable } from "@/components/products/ProductTable"
import { PlusCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { revalidatePath } from "next/cache"

// Server Actions - TODAS recebendo string (id)
async function toggleProductStatus(productId: string) {  // ← Mudou de FormData para string
  "use server"
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return

  // Buscar status atual
  const { data: product } = await supabase
    .from('products')
    .select('is_active')
    .eq('id', productId)
    .single()

  if (!product) return

  // Atualizar status (inverte o status atual)
  await supabase
    .from('products')
    .update({ is_active: !product.is_active })
    .eq('id', productId)

  revalidatePath('/products')
}

async function deleteProduct(productId: string) {
  "use server"
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error("Usuário não autenticado")
    return
  }

  // Verificar se o produto pertence ao usuário
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('user_id')
    .eq('id', productId)
    .single()

  if (fetchError || !product) {
    console.error("Produto não encontrado:", productId)
    return
  }

  if (product.user_id !== user.id) {
    console.error("Usuário não tem permissão para deletar este produto")
    return
  }

  // Deletar produto
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error("Erro ao deletar:", error)
    return
  }

  revalidatePath('/products')
}

async function duplicateProduct(productId: string) {
  "use server"
  
  console.log("🔵 INÍCIO - Duplicando produto:", productId)
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error("🔴 Usuário não autenticado")
    return
  }
  console.log("🟢 Usuário autenticado:", user.id)

  // Buscar produto original
  console.log("🔵 Buscando produto original...")
  const { data: original, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (fetchError || !original) {
    console.error("🔴 Produto original não encontrado:", fetchError)
    return
  }
  console.log("🟢 Produto original encontrado:", original.title)

  if (original.user_id !== user.id) {
    console.error("🔴 Usuário não tem permissão")
    return
  }
  console.log("🟢 Permissão OK")

  // Criar cópia
  const { id, created_at, updated_at, clicks_count, ...productData } = original
  console.log("🟡 Dados para cópia:", productData)

  console.log("🔵 Inserindo cópia...")
  const { error, data } = await supabase
    .from('products')
    .insert({
      ...productData,
      title: `${productData.title} (cópia)`,
      is_active: false,
      clicks_count: 0
    })
    .select()

  if (error) {
    console.error("🔴 Erro ao duplicar:", error)
    return
  }

  console.log("🟢✅ Produto duplicado com sucesso:", data)
  revalidatePath('/products')
}

export default async function ProductsPage() {
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
    .order('created_at', { ascending: false })

  // Calcular estatísticas
  const stats = {
    totalProducts: products?.length || 0,
    activeProducts: products?.filter(p => p.is_active).length || 0,
    totalClicks: products?.reduce((acc, p) => acc + (p.clicks_count || 0), 0) || 0,
    featuredProducts: products?.filter(p => p.is_featured).length || 0
  }

  // Extrair categorias e plataformas únicas
  const categories = [...new Set(products?.map(p => p.category).filter(Boolean))] as string[]
  const platforms = [...new Set(products?.map(p => p.platform).filter(Boolean))] as string[]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Botão Voltar */}
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar ao Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Produtos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos os seus produtos em um só lugar
            </p>
          </div>

          <Link href="/products/new">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-colors">
              <PlusCircle size={20} />
              Novo Produto
            </button>
          </Link>
        </div>

        {/* Estatísticas */}
        <ProductStats {...stats} />

        {/* Filtros */}
        <ProductFilters
          onSearch={async (query) => {
            "use server"
            console.log("Busca:", query)
          }}
          onFilterChange={async (filters) => {
            "use server"
            console.log("Filtros:", filters)
          }}
          categories={categories}
          platforms={platforms}
        />

        {/* Tabela de produtos */}
        <ProductTable
          products={products || []}
          onToggleStatus={toggleProductStatus}  // ← Agora todas são string
          onDelete={deleteProduct}               // ← string
          onDuplicate={duplicateProduct}         // ← string
        />
      </div>
    </div>
  )
}
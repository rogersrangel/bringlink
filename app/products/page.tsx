import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductStats } from "@/components/products/ProductStats"
import { ProductFilters } from "@/components/products/ProductFilters"
import { ProductTable } from "@/components/products/ProductTable"
import { PlusCircle , ArrowLeft} from "lucide-react"
import Link from "next/link"
import { revalidatePath } from "next/cache"

// Server Actions
async function toggleProductStatus(formData: FormData) {
    "use server"

    const productId = formData.get("productId") as string
    const currentStatus = formData.get("currentStatus") === "true"

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Verificar se o produto pertence ao usuário
    const { data: product } = await supabase
        .from('products')
        .select('user_id')
        .eq('id', productId)
        .single()

    if (!product || product.user_id !== user.id) {
        throw new Error("Produto não encontrado")
    }

    // Atualizar status
    await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId)

    revalidatePath('/products')
}

async function deleteProduct(formData: FormData) {
    "use server"

    const productId = formData.get("productId") as string

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Verificar se o produto pertence ao usuário
    const { data: product } = await supabase
        .from('products')
        .select('user_id')
        .eq('id', productId)
        .single()

    if (!product || product.user_id !== user.id) {
        throw new Error("Produto não encontrado")
    }

    // Deletar produto
    await supabase
        .from('products')
        .delete()
        .eq('id', productId)

    revalidatePath('/products')
}

async function duplicateProduct(formData: FormData) {
    "use server"

    const productId = formData.get("productId") as string

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Buscar produto original
    const { data: original } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

    if (!original || original.user_id !== user.id) {
        throw new Error("Produto não encontrado")
    }

    // Criar cópia (removendo id e campos únicos)
    const { id, created_at, updated_at, clicks_count, ...productData } = original

    await supabase
        .from('products')
        .insert({
            ...productData,
            title: `${productData.title} (cópia)`,
            is_active: false, // Cópia começa inativa
            clicks_count: 0
        })

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

    // Extrair categorias e plataformas únicas para filtros
    const categories = [...new Set(products?.map(p => p.category).filter(Boolean))] as string[]
    const platforms = [...new Set(products?.map(p => p.platform).filter(Boolean))] as string[]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex items-center gap-4 mb-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Voltar
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
                        // Implementar busca depois
                        console.log("Busca:", query)
                    }}
                    onFilterChange={async (filters) => {
                        "use server"
                        // Implementar filtros depois
                        console.log("Filtros:", filters)
                    }}
                    categories={categories}
                    platforms={platforms}
                />

                {/* Tabela de produtos */}
                <ProductTable
                    products={products || []}
                    onToggleStatus={toggleProductStatus}
                    onDelete={deleteProduct}
                    onDuplicate={duplicateProduct}
                />
            </div>
        </div>
    )
}
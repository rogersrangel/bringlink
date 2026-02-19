import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductClientWrapper } from "./ProductClientWrapper"
import { revalidatePath } from "next/cache"

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 🔥 Buscar categorias do usuário com is_default
  const { data: userCategories } = await supabase
    .from('categories')
    .select('name, is_default')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  // 🔥 Passar como array de objetos (nome + tipo)
  const categories = userCategories?.map(c => ({
    name: c.name,
    is_default: c.is_default
  })) || []

  async function createProduct(formData: any) {
    "use server"

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    const originalPrice = parseFloat(formData.original_price)
    const discountedPrice = parseFloat(formData.discounted_price)

    const { error } = await supabase
      .from('products')
      .insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        original_price: originalPrice,
        discounted_price: discountedPrice,
        product_url: formData.product_url,
        platform: formData.platform || null,
        category: formData.category || null,
        image_url: formData.image || null,
        is_active: true,
        clicks_count: 0
      })

    if (!error) {
      revalidatePath('/products')
      redirect('/products')
    }
  }

  async function addCategory(categoryName: string) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error("Usuário não autenticado")
    }

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      return // Categoria já existe
    }

    // Inserir nova categoria (sempre is_default = false para categorias do usuário)
    const { error } = await supabase
      .from('categories')
      .insert({
        name: categoryName,
        user_id: user.id,
        is_default: false
      })

    if (error) {
      console.error("Erro ao salvar categoria:", error)
      throw new Error("Erro ao salvar categoria")
    }

    revalidatePath('/products/new')
  }

  async function deleteCategory(categoryName: string) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // Verificar se a categoria está sendo usada por algum produto
    const { data: productsWithCategory } = await supabase
      .from('products')
      .select('id')
      .eq('category', categoryName)
      .eq('user_id', user.id)

    if (productsWithCategory && productsWithCategory.length > 0) {
      throw new Error(`Categoria "${categoryName}" está em uso por ${productsWithCategory.length} produto(s)`)
    }

    // Deletar apenas categorias criadas pelo usuário (is_default = false)
    await supabase
      .from('categories')
      .delete()
      .eq('name', categoryName)
      .eq('user_id', user.id)
      .eq('is_default', false)

    revalidatePath('/products/new')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-2">Adicionar Novo Produto</h1>
        <p className="text-gray-600 mb-8">
          Preencha os dados do produto manualmente ou importe de um link
        </p>

        <ProductClientWrapper
          categories={categories}
          onSubmit={createProduct}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
        />
      </div>
    </div>
  )
}
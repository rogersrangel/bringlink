import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { ProductFormWrapper } from "./ProductFormWrapper"
import { revalidatePath } from "next/cache"

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Buscar o produto pelo ID
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  // Verificar se o produto pertence ao usuário
  if (product.user_id !== user.id) {
    redirect("/products")
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

  async function updateProduct(formData: any) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    const originalPrice = parseFloat(formData.original_price)
    const discountedPrice = parseFloat(formData.discounted_price)
    
    const { error } = await supabase
      .from('products')
      .update({
        title: formData.title,
        description: formData.description || null,
        original_price: originalPrice,
        discounted_price: discountedPrice,
        product_url: formData.product_url,
        platform: formData.platform || null,
        category: formData.category || null,
        image_url: formData.image || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

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

    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .eq('user_id', user.id)
      .single()

    if (existing) return

    const { error } = await supabase
      .from('categories')
      .insert({
        name: categoryName,
        user_id: user.id,
        is_default: false
      })

    if (error) throw new Error("Erro ao salvar categoria")
    
    revalidatePath(`/products/${id}/edit`)
  }

  async function deleteCategory(categoryName: string) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // Verificar se a categoria está em uso
    const { data: productsWithCategory } = await supabase
      .from('products')
      .select('id')
      .eq('category', categoryName)
      .eq('user_id', user.id)

    if (productsWithCategory && productsWithCategory.length > 0) {
      throw new Error(`Categoria em uso por ${productsWithCategory.length} produto(s)`)
    }

    // Deletar apenas categorias criadas pelo usuário (is_default = false)
    await supabase
      .from('categories')
      .delete()
      .eq('name', categoryName)
      .eq('user_id', user.id)
      .eq('is_default', false)

    revalidatePath(`/products/${id}/edit`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-2">Editar Produto</h1>
        <p className="text-gray-600 mb-8">Atualize as informações do produto</p>

        <ProductFormWrapper 
          product={product}
          categories={categories}
          onSubmit={updateProduct}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
        />
      </div>
    </div>
  )
}
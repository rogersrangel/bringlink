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

  // Buscar categorias existentes do usuário
  const { data: products } = await supabase
    .from('products')
    .select('category')
    .eq('user_id', user.id)

  const categories = [...new Set(products?.map(p => p.category).filter(Boolean))] as string[]

  async function createProduct(formData: any) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

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

  // 🔥 FUNÇÃO PARA ADICIONAR NOVA CATEGORIA (opcional)
  // async function addCategory(categoryName: string) {
  //   "use server"
  //   // Aqui você pode implementar lógica para salvar em uma tabela separada
  //   console.log("Nova categoria:", categoryName)
  // }

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
          // onAddCategory={addCategory} // ← Descomente se quiser salvar em tabela separada
        />
      </div>
    </div>
  )
}
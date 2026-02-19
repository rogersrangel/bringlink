import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { ProductFormWrapper } from "./ProductFormWrapper"
import { revalidatePath } from "next/cache"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) notFound()
  if (product.user_id !== user.id) redirect("/products")

  const { data: products } = await supabase
    .from('products')
    .select('category')
    .eq('user_id', user.id)

  const categories = [...new Set(products?.map(p => p.category).filter(Boolean))] as string[]

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
    console.log("Nova categoria na edição:", categoryName)
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
        />
      </div>
    </div>
  )
}
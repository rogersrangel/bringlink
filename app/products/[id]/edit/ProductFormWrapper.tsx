"use client"

import { ProductForm } from "@/components/products/ProductForm"

interface ProductFormWrapperProps {
  product: any
  categories: string[]
  onSubmit: (data: any) => Promise<void>
  onAddCategory?: (category: string) => Promise<void>
}

export function ProductFormWrapper({ 
  product, 
  categories, 
  onSubmit,
  onAddCategory 
}: ProductFormWrapperProps) {
  
  const initialData = {
    title: product.title,
    description: product.description || "",
    original_price: product.original_price,
    discounted_price: product.discounted_price,
    product_url: product.product_url,
    platform: product.platform || "",
    category: product.category || "",
    image: product.image_url
  }

  return (
    <ProductForm 
      categories={categories}
      onSubmit={onSubmit}
      initialData={initialData}
      isEditing={true}
      onAddCategory={onAddCategory}
    />
  )
}
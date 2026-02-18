"use client"

import { ProductForm } from "@/components/products/ProductForm"

interface ProductFormWrapperProps {
  product: any
  categories: string[]
  onSubmit: (data: any) => Promise<void>
}

export function ProductFormWrapper({ product, categories, onSubmit }: ProductFormWrapperProps) {
  // Converte os dados do produto para o formato que o ProductForm espera
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
    />
  )
}
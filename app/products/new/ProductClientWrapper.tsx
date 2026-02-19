"use client"

import { useState } from "react"
import { ProductScraper } from "@/components/products/ProductScraper"
import { ProductForm } from "@/components/products/ProductForm"

interface ProductClientWrapperProps {
  categories: string[]
  onSubmit: (data: any) => Promise<void>
  onAddCategory?: (category: string) => Promise<void> // ← Declarada aqui
}

export function ProductClientWrapper({ 
  categories, 
  onSubmit, 
  onAddCategory // ← RECEBENDO A PROP AQUI!
}: ProductClientWrapperProps) {
  const [scrapedData, setScrapedData] = useState<any>(null)

  const handleProductFetched = (data: any) => {
    console.log("📦 ProductClientWrapper recebeu:", data)
    setScrapedData(data)
  }

  return (
    <>
      <ProductScraper onProductFetched={handleProductFetched} />
      <ProductForm 
        categories={categories}
        onSubmit={onSubmit}
        initialData={scrapedData}
        isEditing={false}
        onAddCategory={onAddCategory} // ← AGORA FUNCIONA!
      />
    </>
  )
}
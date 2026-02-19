"use client"

import { useState } from "react"
import { ProductScraper } from "@/components/products/ProductScraper"
import { ProductForm } from "@/components/products/ProductForm"

interface ProductClientWrapperProps {
  categories: string[]
  onSubmit: (data: any) => Promise<void>
}

export function ProductClientWrapper({ categories, onSubmit }: ProductClientWrapperProps) {
  const [scrapedData, setScrapedData] = useState<any>(null)

  const handleProductFetched = (data: any) => {
    console.log("📦 Dados recebidos do scraper:", data)
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
      />
    </>
  )
}
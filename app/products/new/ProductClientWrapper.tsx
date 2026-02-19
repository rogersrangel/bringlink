"use client"

import { useState } from "react"
import { ProductScraper } from "@/components/products/ProductScraper"
import { ProductForm } from "@/components/products/ProductForm"

interface ProductClientWrapperProps {
  categories: string[]
  onSubmit: (data: any) => Promise<void>
  onAddCategory?: (category: string) => Promise<void>
  onDeleteCategory?: (category: string) => Promise<void>
}

export function ProductClientWrapper({ 
  categories, 
  onSubmit, 
  onAddCategory,
  onDeleteCategory 
}: ProductClientWrapperProps) {
  const [scrapedData, setScrapedData] = useState<any>(null)
  const [categoryVersion, setCategoryVersion] = useState(0)

  const handleProductFetched = (data: any) => {
    setScrapedData(data)
  }

  const handleAddCategory = async (newCat: string) => {
    await onAddCategory?.(newCat)
    setCategoryVersion(prev => prev + 1)
  }

  const handleDeleteCategory = async (cat: string) => {
    await onDeleteCategory?.(cat)
    setCategoryVersion(prev => prev + 1)
  }

  return (
    <>
      <ProductScraper onProductFetched={handleProductFetched} />
      <ProductForm 
        key={categoryVersion}
        categories={categories}
        onSubmit={onSubmit}
        initialData={scrapedData}
        isEditing={false}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </>
  )
}
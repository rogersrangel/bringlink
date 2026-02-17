"use client"

import { ProductScraper } from "@/components/products/ProductScraper"

export function ProductScraperWrapper() {
  return <ProductScraper onProductFetched={(data) => {
    // Aqui você vai preencher o formulário com os dados
    console.log("Produto importado:", data)
    // TODO: Disparar evento para preencher o formulário
  }} />
}
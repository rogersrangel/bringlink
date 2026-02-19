"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "./ImageUpload"
import { CategorySelect } from "./CategorySelect"
import { ProductPreview } from "./ProductPreview"

interface ProductFormProps {
  initialData?: any
  categories: string[]
  onSubmit: (data: any) => Promise<void>
  isEditing?: boolean
  onAddCategory?: (category: string) => Promise<void>
}

export function ProductForm({ 
  initialData, 
  categories, 
  onSubmit, 
  isEditing,
  onAddCategory 
}: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    original_price: "",
    discounted_price: "",
    product_url: "",
    platform: "",
    category: "",
    image: null
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        original_price: initialData.original_price?.toString() || "",
        discounted_price: initialData.discounted_price?.toString() || "",
        product_url: initialData.product_url || "",
        platform: initialData.platform || "",
        category: initialData.category || "",
        image: initialData.image || null
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      router.push("/products")
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setLoading(false)
    }
  }

  const previewData = {
    title: formData.title || "Título do Produto",
    price: Number(formData.discounted_price) || 0,
    originalPrice: Number(formData.original_price) || undefined,
    image: formData.image,
    platform: formData.platform
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header com botão Voltar e Salvar */}
      <div className="flex items-center justify-between">
        <Link href="/products" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} /> Voltar
        </Link>
        <motion.button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Salvando..." : isEditing ? "Atualizar Produto" : "Salvar Produto"}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna do Formulário */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Informações do Produto</h2>
            <div className="space-y-4">
              {/* Campo Título */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700">Título do Produto *</label>
                  <span className="text-xs text-gray-400">{formData.title.length}/100</span>
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Headset Gamer RGB Wireless"
                />
              </div>

              {/* Campo Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Descreva o produto..."
                />
                <div className="text-right text-xs text-gray-400 mt-1">{formData.description.length}/500</div>
              </div>

              {/* Campos de Preço */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Original *</label>
                  <input
                    type="number"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="299.90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço com Desconto *</label>
                  <input
                    type="number"
                    name="discounted_price"
                    value={formData.discounted_price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="189.90"
                  />
                </div>
              </div>

              {/* Link do Produto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link do Produto *</label>
                <input
                  type="url"
                  name="product_url"
                  value={formData.product_url}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="https://shopee.com.br/product/123..."
                />
              </div>

              {/* Plataforma e Categoria */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecione</option>
                    <option value="shopee">Shopee</option>
                    <option value="aliexpress">AliExpress</option>
                    <option value="mercadolivre">Mercado Livre</option>
                    <option value="amazon">Amazon</option>
                    <option value="other">Outra</option>
                  </select>
                </div>

                {/* Componente CategorySelect */}
                <CategorySelect
                  categories={categories}
                  selected={formData.category}
                  onSelect={(cat) => setFormData({ ...formData, category: cat })}
                  onAddNew={onAddCategory}
                />
              </div>
            </div>
          </div>

          {/* Upload de Imagem */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <ImageUpload
              onImageUpload={(file) => console.log("Imagem:", file)}
              defaultImage={formData.image}
            />
          </div>
        </div>

        {/* Coluna de Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <ProductPreview data={previewData} />
          </div>
        </div>
      </div>
    </form>
  )
}
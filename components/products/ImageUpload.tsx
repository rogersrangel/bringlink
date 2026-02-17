"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onImageUpload: (file: File | null) => void
  defaultImage?: string | null
}

export function ImageUpload({ onImageUpload, defaultImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageUpload(file)
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const removeImage = () => {
    setPreview(null)
    onImageUpload(null)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Imagem do Produto
      </label>
      
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? "border-purple-500 bg-purple-50" 
                : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            {isDragActive ? (
              <p className="text-purple-600">Solte a imagem aqui...</p>
            ) : (
              <>
                <p className="text-gray-600">
                  Arraste uma imagem ou <span className="text-purple-600">clique para selecionar</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG ou WEBP (max. 5MB)
                </p>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-xl overflow-hidden border border-gray-200"
          >
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
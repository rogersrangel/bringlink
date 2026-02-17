"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Camera } from "lucide-react"

interface AvatarUploadProps {
  currentAvatar: string | null
  onUpload: (file: File) => void
  username: string
}

export function AvatarUpload({ currentAvatar, onUpload, username }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onUpload(file)
    }
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400">
          {preview ? (
            <img src={preview} alt={username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-3xl">
              {username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <label 
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 p-1.5 bg-purple-600 text-white rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
        >
          <Camera size={16} />
        </label>
        
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <div>
        <h3 className="font-medium">Foto de Perfil</h3>
        <p className="text-sm text-gray-500">
          JPG, PNG ou GIF. Máximo 5MB.
        </p>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Loader2, Check, X } from "lucide-react"

interface ProfileFormProps {
  initialData: {
    display_name: string
    username: string
    bio: string | null
    location: string | null
  }
  onSubmit: (data: any) => Promise<void>
  onCheckUsername: (username: string) => Promise<boolean>
}

export function ProfileForm({ initialData, onSubmit, onCheckUsername }: ProfileFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    if (name === 'username') {
      setUsernameAvailable(null)
    }
  }

  const checkUsername = async () => {
    if (!formData.username || formData.username === initialData.username) {
      setUsernameAvailable(null)
      return
    }
    
    setCheckingUsername(true)
    const available = await onCheckUsername(formData.username)
    setUsernameAvailable(available)
    setCheckingUsername(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(formData)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome de exibição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome de exibição
        </label>
        <input
          type="text"
          name="display_name"
          value={formData.display_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              @
            </span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={checkUsername}
              required
              className="w-full pl-8 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {usernameAvailable !== null && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {usernameAvailable ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <X size={18} className="text-red-500" />
                )}
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={checkUsername}
            disabled={checkingUsername}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {checkingUsername ? "Verificando..." : "Verificar"}
          </button>
        </div>
        {usernameAvailable === false && (
          <p className="text-sm text-red-500 mt-1">
            Este username já está em uso
          </p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Fale um pouco sobre você..."
        />
      </div>

      {/* Localização */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Localização
        </label>
        <input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Cidade, Estado"
        />
      </div>

      {/* Botão salvar */}
      <motion.button
        type="submit"
        disabled={loading || usernameAvailable === false}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Save size={18} />
        )}
        {loading ? "Salvando..." : "Salvar alterações"}
      </motion.button>
    </form>
  )
}
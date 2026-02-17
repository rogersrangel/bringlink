"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Instagram, Youtube, Twitter, Globe, Save, Loader2 } from "lucide-react"

interface SocialLinksProps {
  initialData: {
    instagram: string | null
    youtube: string | null
    tiktok: string | null
    website: string | null
  }
  onSubmit: (data: any) => Promise<void>
}

export function SocialLinks({ initialData, onSubmit }: SocialLinksProps) {
  const [links, setLinks] = useState({
    instagram: initialData.instagram || '',
    youtube: initialData.youtube || '',
    tiktok: initialData.tiktok || '',
    website: initialData.website || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (key: string, value: string) => {
    setLinks(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(links)
    setLoading(false)
  }

  const socials = [
    { key: 'instagram', icon: Instagram, placeholder: '@seuusuario', color: 'text-pink-600' },
    { key: 'youtube', icon: Youtube, placeholder: '@seucanal', color: 'text-red-600' },
    { key: 'tiktok', icon: Twitter, placeholder: '@seuusuario', color: 'text-blue-400' },
    { key: 'website', icon: Globe, placeholder: 'https://seusite.com', color: 'text-purple-600' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">Redes Sociais</h3>
      
      {socials.map((social) => {
        const Icon = social.icon
        return (
          <div key={social.key} className="flex items-center gap-3">
            <Icon size={20} className={social.color} />
            <input
              type="text"
              value={links[social.key as keyof typeof links]}
              onChange={(e) => handleChange(social.key, e.target.value)}
              placeholder={social.placeholder}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )
      })}

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Save size={18} />
        )}
        {loading ? "Salvando..." : "Salvar redes sociais"}
      </motion.button>
    </form>
  )
}
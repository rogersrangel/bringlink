"use client"

import { useState } from "react"
import { Instagram, Youtube, Twitter, Globe, Link as LinkIcon } from "lucide-react"

interface SocialLinksProps {
  initialData: {
    instagram: string | null
    youtube: string | null
    tiktok: string | null
    website: string | null
  }
  onChange: (data: any) => void
}

export function SocialLinks({ initialData, onChange }: SocialLinksProps) {
  const [links, setLinks] = useState(initialData)

  const handleChange = (key: string, value: string) => {
    const newLinks = { ...links, [key]: value }
    setLinks(newLinks)
    onChange(newLinks)
  }

  const socials = [
    { key: 'instagram', icon: Instagram, placeholder: '@seuusuario', color: 'text-pink-600' },
    { key: 'youtube', icon: Youtube, placeholder: '@seucanal', color: 'text-red-600' },
    { key: 'tiktok', icon: Twitter, placeholder: '@seuusuario', color: 'text-blue-400' },
    { key: 'website', icon: Globe, placeholder: 'https://seusite.com', color: 'text-purple-600' }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Redes Sociais</h3>
      
      {socials.map((social) => {
        const Icon = social.icon
        return (
          <div key={social.key} className="flex items-center gap-3">
            <Icon size={20} className={social.color} />
            <input
              type="text"
              value={links[social.key as keyof typeof links] || ''}
              onChange={(e) => handleChange(social.key, e.target.value)}
              placeholder={social.placeholder}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )
      })}
    </div>
  )
}
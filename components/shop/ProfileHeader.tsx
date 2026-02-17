"use client"

import { motion } from "framer-motion"
import { Instagram, Youtube, Twitter, Globe, MapPin } from "lucide-react"
import Link from "next/link"

interface ProfileHeaderProps {
  profile: {
    display_name: string | null
    username: string
    avatar_url: string | null
    bio: string | null
    instagram: string | null
    youtube: string | null
    tiktok: string | null
    website: string | null
    location?: string
    followers?: string
    rating?: number
  }
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  // Valores padrão para evitar erros
  const displayName = profile.display_name || profile.username || "Usuário"
  const username = profile.username || ""
  
  const socialLinks = [
    { icon: Instagram, href: profile.instagram, color: "hover:text-pink-600", show: profile.instagram },
    { icon: Youtube, href: profile.youtube, color: "hover:text-red-600", show: profile.youtube },
    { icon: Twitter, href: profile.tiktok, color: "hover:text-blue-400", show: profile.tiktok },
    { icon: Globe, href: profile.website, color: "hover:text-purple-600", show: profile.website }
  ].filter(social => social.show)

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Banner de capa */}
      <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600"></div>
      
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-3xl">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-gray-500">@{username}</p>
          </div>

          {/* Redes sociais */}
          <div className="flex gap-2 mt-2 sm:mt-0">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={index}
                  href={social.href || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 bg-gray-100 rounded-lg text-gray-600 ${social.color} transition-colors`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                </motion.a>
              )
            })}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-gray-700 mb-4">{profile.bio}</p>
        )}

        {/* Info extra */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              {profile.location}
            </div>
          )}
          {profile.followers && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">{profile.followers}</span>
              seguidores
            </div>
          )}
          {profile.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              {profile.rating}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
"use client"

import { ProfileForm } from "@/components/settings/ProfileForm"
import { SocialLinks } from "@/components/settings/SocialLinks"
import { AvatarUpload } from "@/components/settings/AvatarUpload"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface SettingsClientWrapperProps {
  profile: any
  onUpdateProfile: (data: any) => Promise<void>
  onUpdateSocial: (data: any) => Promise<void>
  onCheckUsername: (username: string) => Promise<boolean>
}

export function SettingsClientWrapper({ 
  profile, 
  onUpdateProfile, 
  onUpdateSocial,
  onCheckUsername 
}: SettingsClientWrapperProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleProfileSubmit = async (data: any) => {
    console.log("📥 SettingsClientWrapper - Recebido:", data)
    setIsSaving(true)
    try {
      await onUpdateProfile(data) // Agora é void, não espera retorno
      router.refresh()
    } catch (error) {
      console.error("❌ SettingsClientWrapper - Erro:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSocialSubmit = async (data: any) => {
    setIsSaving(true)
    try {
      await onUpdateSocial(data)
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar redes sociais:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <AvatarUpload 
          currentAvatar={profile.avatar_url}
          onUpload={async (file) => {
            console.log("Upload avatar:", file)
          }}
          username={profile.username}
        />
      </div>

      {/* Informações do Perfil */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ProfileForm 
          initialData={{
            display_name: profile.display_name,
            username: profile.username,
            bio: profile.bio || "",
            location: profile.location || ""
          }}
          onSubmit={handleProfileSubmit}
          onCheckUsername={onCheckUsername}
          isSaving={isSaving}
        />
      </div>

      {/* Redes Sociais */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <SocialLinks 
          initialData={{
            instagram: profile.instagram || "",
            youtube: profile.youtube || "",
            tiktok: profile.tiktok || "",
            website: profile.website || ""
          }}
          onSubmit={handleSocialSubmit}
          isSaving={isSaving}
        />
      </div>
    </div>
  )
}
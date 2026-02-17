"use client"

import { ProfileForm } from "@/components/settings/ProfileForm"
import { SocialLinks } from "@/components/settings/SocialLinks"
import { AvatarUpload } from "@/components/settings/AvatarUpload"

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
  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <AvatarUpload 
          currentAvatar={profile.avatar_url}
          onUpload={async (file) => {
            // Implementar depois
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
            bio: profile.bio,
            location: profile.location
          }}
          onSubmit={onUpdateProfile}
          onCheckUsername={onCheckUsername}
        />
      </div>

      {/* Redes Sociais */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <SocialLinks 
          initialData={{
            instagram: profile.instagram,
            youtube: profile.youtube,
            tiktok: profile.tiktok,
            website: profile.website
          }}
          onSubmit={onUpdateSocial}
        />
      </div>
    </div>
  )
}
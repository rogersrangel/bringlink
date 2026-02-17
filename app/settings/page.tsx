import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { AvatarUpload } from "@/components/settings/AvatarUpload"
import { ProfileForm } from "@/components/settings/ProfileForm"
import { SocialLinks } from "@/components/settings/SocialLinks"
import { revalidatePath } from "next/cache"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Buscar perfil do usuário
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    notFound()
  }

  async function updateProfile(formData: any) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    await supabase
      .from('profiles')
      .update({
        display_name: formData.display_name,
        username: formData.username,
        bio: formData.bio || null,
        location: formData.location || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    revalidatePath('/settings')
  }

  async function updateSocialLinks(formData: any) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    await supabase
      .from('profiles')
      .update({
        instagram: formData.instagram || null,
        youtube: formData.youtube || null,
        tiktok: formData.tiktok || null,
        website: formData.website || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    revalidatePath('/settings')
  }

  async function checkUsername(username: string) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .single()

    return !data // Retorna true se disponível
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-gray-600 mb-8">
          Gerencie suas informações pessoais
        </p>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <AvatarUpload 
              currentAvatar={profile.avatar_url}
              onUpload={async (file) => {
                "use server"
                // TODO: Implementar upload para Supabase Storage
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
              onSubmit={updateProfile}
              onCheckUsername={checkUsername}
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
              onChange={async (data) => {
                "use server"
                await updateSocialLinks(data)
              }}
            />
          </div>

          {/* Plano Atual */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium mb-4">Plano Atual</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold capitalize">{profile.plan_type}</p>
                <p className="text-sm text-gray-500">
                  {profile.plan_type === 'free' ? 'Plano gratuito' : 'Plano profissional'}
                </p>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                {profile.plan_type === 'free' ? 'Fazer upgrade' : 'Gerenciar plano'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
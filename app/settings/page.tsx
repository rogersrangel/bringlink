import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { SettingsClientWrapper } from "./SettingsClientWrapper"
import { revalidatePath } from "next/cache"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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
    
    console.log("🖥️ Server Action - Recebido:", formData)
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log("🖥️ Server Action - Usuário não autenticado")
      return // ← Remove o objeto de retorno
    }

    console.log("🖥️ Server Action - User ID:", user.id)
    console.log("🖥️ Server Action - Dados para update:", {
      display_name: formData.display_name,
      username: formData.username,
      bio: formData.bio,
      location: formData.location
    })

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: formData.display_name,
        username: formData.username,
        bio: formData.bio || null,
        location: formData.location || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      console.error("🖥️ Server Action - Erro no Supabase:", error)
      return // ← Remove o objeto de retorno
    }

    console.log("🖥️ Server Action - Sucesso!")
    revalidatePath('/settings')
    // Não retorna nada (void)
  }

  async function updateSocialLinks(formData: any) {
    "use server"
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

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

    if (!user) return false

    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .single()

    return !data
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar ao Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-gray-600 mb-8">
          Gerencie suas informações pessoais
        </p>

        <SettingsClientWrapper 
          profile={profile}
          onUpdateProfile={updateProfile}
          onUpdateSocial={updateSocialLinks}
          onCheckUsername={checkUsername}
        />
      </div>
    </div>
  )
}
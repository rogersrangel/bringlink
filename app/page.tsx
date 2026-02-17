"use client"

import { useState } from "react"
import { AuthCard } from "@/components/auth/AuthCard"
import { AuthInput } from "@/components/auth/AuthInput"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error
      
      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google")
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      title="Bem-vindo de volta! 👋"
      subtitle="Faça login para acessar sua conta"
      alternativeText="Não tem uma conta?"
      alternativeLink="/register"
      alternativeLinkText="Cadastre-se"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <AuthInput
          label="Email"
          type="email"
          name="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <AuthInput
          label="Senha"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <div className="flex justify-end">
          <button 
            type="button"
            className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            type="submit" 
            className="w-full py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </motion.div>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>

      <GoogleButton onClick={handleGoogleLogin} />
    </AuthCard>
  )
}
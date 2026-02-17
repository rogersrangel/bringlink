"use client"

import { useState } from "react"
import { AuthCard } from "@/components/auth/AuthCard"
import { AuthInput } from "@/components/auth/AuthInput"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Check } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError("")
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return false
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          }
        }
      })

      if (error) throw error
      
      // Redirecionar para confirmação ou dashboard
      router.push("/dashboard?welcome=true")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
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
      setError(err.message || "Erro ao registrar com Google")
      setIsLoading(false)
    }
  }

  return (
    <AuthCard
      title="Crie sua conta 🚀"
      subtitle="Comece a gerenciar seus links em minutos"
      alternativeText="Já tem uma conta?"
      alternativeLink="/login"
      alternativeLinkText="Fazer login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <AuthInput
          label="Nome"
          type="text"
          name="name"
          placeholder="Seu nome"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

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

        <AuthInput
          label="Confirmar Senha"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <div className="flex items-start gap-2">
          <input type="checkbox" id="terms" className="mt-1" required />
          <label htmlFor="terms" className="text-sm text-gray-600">
            Eu concordo com os{" "}
            <a href="/termos" className="text-purple-600 hover:underline">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="/privacidade" className="text-purple-600 hover:underline">
              Política de Privacidade
            </a>
          </label>
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
            {isLoading ? "Criando conta..." : "Criar conta"}
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

      <GoogleButton onClick={handleGoogleRegister} />

      <div className="mt-6 p-4 bg-purple-50 rounded-xl">
        <p className="text-sm font-medium text-purple-900 mb-2">🔒 Ao se cadastrar, você ganha:</p>
        <ul className="space-y-1 text-sm text-purple-800">
          <li className="flex items-center gap-2">
            <Check size={16} className="text-purple-600" />
            Vitrine gratuita com 10 produtos
          </li>
          <li className="flex items-center gap-2">
            <Check size={16} className="text-purple-600" />
            Analytics dos últimos 7 dias
          </li>
          <li className="flex items-center gap-2">
            <Check size={16} className="text-purple-600" />
            Suporte por email
          </li>
        </ul>
      </div>
    </AuthCard>
  )
}
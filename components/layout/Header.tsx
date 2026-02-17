"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          🔗 Bringlink<span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Pro</span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#recursos" className="text-gray-600 hover:text-gray-900 transition">
            Recursos
          </Link>
          <Link href="#precos" className="text-gray-600 hover:text-gray-900 transition">
            Preços
          </Link>
          <Link href="#sobre" className="text-gray-600 hover:text-gray-900 transition">
            Sobre
          </Link>
        </nav>

        {/* Botões Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Registrar</Link>
          </Button>
        </div>

        {/* Botão Menu Mobile */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile Animado */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white border-b"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link 
                href="#recursos" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Recursos
              </Link>
              <Link 
                href="#precos" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Preços
              </Link>
              <Link 
                href="#sobre" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register">Registrar</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
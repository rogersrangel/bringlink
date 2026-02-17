"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Github,
  Mail,
  Heart
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    produto: [
      { name: "Recursos", href: "#recursos" },
      { name: "Preços", href: "#precos" },
      { name: "FAQ", href: "#faq" },
      { name: "Blog", href: "/blog" },
    ],
    empresa: [
      { name: "Sobre", href: "/sobre" },
      { name: "Contato", href: "/contato" },
      { name: "Termos de Uso", href: "/termos" },
      { name: "Privacidade", href: "/privacidade" },
    ],
    suporte: [
      { name: "Central de Ajuda", href: "/ajuda" },
      { name: "Tutoriais", href: "/tutoriais" },
      { name: "Status", href: "/status" },
      { name: "API", href: "/api" },
    ]
  }

  const redesSociais = [
    { icon: Facebook, href: "https://facebook.com/linkhubpro", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/linkhubpro", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/linkhubpro", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/linkhubpro", label: "YouTube" },
    { icon: Github, href: "https://github.com/linkhubpro", label: "GitHub" },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo e descrição */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">
                🔗 Bringlink<span className="text-purple-400">Pro</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              A plataforma completa para criadores de conteúdo gerenciarem 
              seus links de afiliado e aumentarem suas conversões.
            </p>
            
            {/* Newsletter */}
            <div className="mt-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Receba novidades por email
              </label>
              <div className="flex max-w-md">
                <input
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                />
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg transition-colors">
                  <Mail size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Links - Produto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produto</h3>
            <ul className="space-y-2">
              {links.produto.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Empresa */}
          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {links.empresa.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Suporte */}
          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              {links.suporte.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span>© {currentYear} Bringlink Pro. Todos os direitos reservados.</span>
            <span className="hidden md:inline mx-2">•</span>
            <span className="flex items-center gap-1">
              Feito com <Heart size={14} className="text-red-500 fill-red-500" /> no Brasil
            </span>
          </div>

          {/* Redes sociais */}
          <div className="flex gap-4">
            {redesSociais.map((rede) => {
              const Icon = rede.icon
              return (
                <motion.a
                  key={rede.label}
                  href={rede.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={rede.label}
                >
                  <Icon size={20} />
                </motion.a>
              )
            })}
          </div>
        </div>

        {/* Selos de confiança */}
        <motion.div 
          className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <span className="px-3 py-1 bg-gray-800 rounded-full">🔒 Pagamento 100% seguro</span>
          <span className="px-3 py-1 bg-gray-800 rounded-full">🚚 Parceria com Shopee</span>
          <span className="px-3 py-1 bg-gray-800 rounded-full">⭐ Avaliação 4.9 no Reclame Aqui</span>
          <span className="px-3 py-1 bg-gray-800 rounded-full">📱 App (em breve)</span>
        </motion.div>
      </div>
    </footer>
  )
}
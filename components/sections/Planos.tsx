"use client"

import { motion } from "framer-motion"
import { PlanCard } from "./PlanCard"
import { HelpCircle } from "lucide-react"

const planos = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    description: "Para começar e testar a plataforma",
    color: "from-gray-400 to-gray-500",
    features: [
      { name: "Até 10 produtos na vitrine", included: true },
      { name: "Analytics dos últimos 7 dias", included: true },
      { name: "Links encurtados com Bitly", included: true },
      { name: "Suporte por email (72h)", included: true },
      { name: "Links com sua marca", included: false },
      { name: "Múltiplas páginas de bio", included: false },
      { name: "Exportação de relatórios", included: false },
      { name: "Remoção da marca LinkHub", included: false },
    ],
    cta: "Começar Grátis"
  },
  {
    name: "Pro",
    price: "R$ 29,90",
    period: "/mês",
    description: "Para criadores que levam a sério",
    color: "from-purple-600 to-blue-600",
    popular: true,
    features: [
      { name: "Produtos ilimitados", included: true },
      { name: "Analytics completo + histórico", included: true },
      { name: "Links personalizados (seudominio.com)", included: true },
      { name: "Suporte prioritário (chat/24h)", included: true },
      { name: "Múltiplas páginas de bio", included: true },
      { name: "Exportação de relatórios (PDF/CSV)", included: true },
      { name: "Remoção da marca LinkHub", included: true },
      { name: "Domínio personalizado", included: true },
    ],
    cta: "Assinar Pro"
  },
  {
    name: "Business",
    price: "R$ 99,90",
    period: "/mês",
    description: "Para agências e times",
    color: "from-blue-600 to-indigo-600",
    features: [
      { name: "Tudo do plano Pro", included: true },
      { name: "5 usuários na equipe", included: true },
      { name: "API dedicada", included: true },
      { name: "Onboarding VIP", included: true },
      { name: "SLA garantido", included: true },
      { name: "Contas personalizadas", included: true },
      { name: "Relatórios avançados", included: true },
      { name: "Gerente de sucesso", included: true },
    ],
    cta: "Falar com Suporte"
  }
]

export function Planos() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50" id="precos">
      <div className="container mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-purple-600">💰 PREÇOS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Invista no seu sucesso
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu momento. Cancele quando quiser, sem multa.
          </p>
        </motion.div>

        {/* Grid de planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 items-start">
          {planos.map((plano, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <PlanCard {...plano} />
            </motion.div>
          ))}
        </div>

        {/* Garantia e informações extras */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <HelpCircle size={20} className="text-purple-600" />
            <span className="text-gray-700">
              Todos os planos têm <strong>garantia de 7 dias</strong>. Se não gostar, devolvemos seu dinheiro.
            </span>
          </div>
        </motion.div>

        {/* Comparativo rápido */}
        <motion.div 
          className="mt-16 p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold mb-6 text-center">Comparação rápida</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">🎁</div>
              <div className="font-semibold">Free</div>
              <div className="text-sm text-gray-500">Ideal para testar</div>
            </div>
            <div className="md:scale-110">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-semibold text-purple-600">Pro</div>
              <div className="text-sm text-gray-500">Mais escolhido</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🏢</div>
              <div className="font-semibold">Business</div>
              <div className="text-sm text-gray-500">Para times</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
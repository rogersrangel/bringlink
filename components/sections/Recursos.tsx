"use client"

import { motion } from "framer-motion"
import { FeatureCard } from "./FeatureCard"
import { 
  Link2, 
  BarChart3, 
  Sparkles, 
  ShoppingBag, 
  Globe, 
  Zap 
} from "lucide-react"

const recursos = [
  {
    icon: <Link2 size={24} />,
    title: "Link Inteligente",
    description: "Cole o link do produto e pegamos imagem, título e preço automaticamente",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Analytics em Tempo Real",
    description: "Veja país, dispositivo e cada clique nos seus produtos",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <Sparkles size={24} />,
    title: "Design Responsivo",
    description: "Funciona perfeitamente em celular, tablet e desktop",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <ShoppingBag size={24} />,
    title: "Vitrine Organizada",
    description: "Seus produtos em grid bonito e profissional",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: <Globe size={24} />,
    title: "Links Encurtados",
    description: "Links limpos e com sua marca",
    color: "from-pink-500 to-pink-600"
  },
  {
    icon: <Zap size={24} />,
    title: "Alta Conversão",
    description: "Layout otimizado para vender mais",
    color: "from-yellow-500 to-yellow-600"
  }
]

export function Recursos() {
  return (
    <section className="py-20 px-4" id="recursos">
      <div className="container mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-purple-600">⚡ RECURSOS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Ferramentas poderosas para criar, gerenciar e analisar seus links de afiliado
          </p>
        </motion.div>

        {/* Grid de recursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recursos.map((recurso, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard {...recurso} />
            </motion.div>
          ))}
        </div>

        {/* Números/Estatísticas */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold">+50k</div>
            <div className="text-sm opacity-90">Links criados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">+1k</div>
            <div className="text-sm opacity-90">Criadores</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">+2M</div>
            <div className="text-sm opacity-90">Cliques</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">15+</div>
            <div className="text-sm opacity-90">Países</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
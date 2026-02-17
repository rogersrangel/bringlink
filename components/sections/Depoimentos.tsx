"use client"

import { motion } from "framer-motion"
import { TestimonialCard } from "./TestimonialCard"
import { Quote } from "lucide-react"

const depoimentos = [
  {
    name: "Carlos Tech",
    username: "@carlos_tech",
    avatar: "👨‍💻",
    text: "Aumentei minhas vendas em 40% com a vitrine organizada! Antes eu postava links soltos nos stories, agora tenho um lugar profissional onde meus seguidores encontram tudo. O analytics me mostrou que 70% dos cliques são do Nordeste, então comecei a fazer conteúdo mais direcionado.",
    rating: 5,
    subscribers: "150k"
  },
  {
    name: "Ana Gamer",
    username: "@anagamer",
    avatar: "🎮",
    text: "Finalmente um produto brasileiro que entende de afiliados! A Shopee e o Mercado Livre são minhas principais fontes de renda, e o LinkHub Pro facilitou demais minha vida. Agora consigo organizar todos os produtos que recomendo e ainda vejo estatísticas detalhadas.",
    rating: 5,
    subscribers: "200k"
  },
  {
    name: "Pedro Reviews",
    username: "@pedro_reviews",
    avatar: "📱",
    text: "Testei várias ferramentas gringas, mas nenhuma tinha integração boa com as plataformas brasileiras. Aqui o scraper pega tudo certinho da Shopee e AliExpress. Economizo horas por semana que antes gastava editando imagem e título manualmente.",
    rating: 5,
    subscribers: "80k"
  },
  {
    name: "Julia Make",
    username: "@juliamake",
    avatar: "💄",
    text: "Meus seguidores amaram! A vitrine ficou muito profissional, parece site de marca grande. E o melhor: consigo atualizar os preços em segundos quando acaba a promoção. Recomendo demais!",
    rating: 4,
    subscribers: "95k"
  },
  {
    name: "Rafael Fit",
    username: "@rafa_fit",
    avatar: "💪",
    text: "Uso para divulgar meus parceiros de suplementos e equipamentos. A taxa de clique aumentou muito porque agora os links são encurtados e bonitos, não aqueles links gigantescos. Vale cada centavo do plano pro.",
    rating: 5,
    subscribers: "120k"
  },
  {
    name: "Camila Lifestyle",
    username: "@camilalife",
    avatar: "🌿",
    text: "A funcionalidade de adicionar link manualmente salvou minha vida com produtos que não são das grandes plataformas. Consigo colocar foto bonita e título personalizado. Meus stories nunca mais foram os mesmos!",
    rating: 5,
    subscribers: "60k"
  }
]

export function Depoimentos() {
  return (
    <section className="py-20 px-4 bg-gray-50" id="depoimentos">
      <div className="container mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-purple-600">💬 DEPOIMENTOS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Quem usa, recomenda
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Veja o que os criadores estão falando sobre o Bringlink Pro
          </p>
        </motion.div>

        {/* Grid de depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {depoimentos.map((depoimento, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TestimonialCard {...depoimento} />
            </motion.div>
          ))}
        </div>

        {/* Selo de confiança */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <Quote size={20} className="text-purple-600" />
            <span className="text-gray-700">
              <strong>+1000 criadores</strong> já estão faturando mais
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
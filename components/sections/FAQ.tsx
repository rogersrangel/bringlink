"use client"

import { motion } from "framer-motion"
import { FAQItem } from "./FAQItem"
import { MessageCircle, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const faqs = [
  {
    question: "Posso usar links da Shopee, AliExpress e Mercado Livre?",
    answer: "Sim! Nosso sistema identifica automaticamente cada plataforma. Basta colar o link do produto e nós extraímos imagem, título e preço automaticamente. Funciona com Shopee, AliExpress, Mercado Livre, Amazon e mais de 10 outras plataformas."
  },
  {
    question: "Preciso de conhecimentos técnicos para usar?",
    answer: "Não! O LinkHub Pro foi feito para ser extremamente simples. Você cola o link do produto ou faz upload da imagem, e pronto. Tudo é intuitivo e com preview em tempo real. Se tiver dúvidas, nosso suporte está pronto para ajudar."
  },
  {
    question: "Como funciona o pagamento?",
    answer: "Aceitamos cartão de crédito (à vista ou parcelado), PIX (aprovado na hora) e boleto bancário (aprovado em até 3 dias úteis). A cobrança é feita de forma segura pela Stripe, a mesma processadora do Uber e Amazon."
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim! Sem multa, sem fidelidade, sem burocracia. Você pode cancelar a qualquer momento pelo painel de controle e continuará tendo acesso até o final do período já pago."
  },
  {
    question: "O que acontece se eu sair do plano Free para o Pro?",
    answer: "Você mantém todos os seus produtos e configurações. A única diferença é que ganha acesso a todos os recursos do plano Pro imediatamente. O pagamento é proporcional ao dia que você fez o upgrade."
  },
  {
    question: "Os links encurtados contam como clique normalmente?",
    answer: "Sim! Usamos integração com Bitly e também oferecemos links personalizados com seu próprio domínio no plano Pro. Todos os cliques são rastreados e aparecem no seu dashboard em tempo real, com dados de país, dispositivo e horário."
  },
  {
    question: "Tem limite de visualizações na página?",
    answer: "Não! Todos os planos têm visualizações ilimitadas na sua vitrine. O limite é apenas na quantidade de produtos que você pode cadastrar (10 no Free, ilimitado no Pro)."
  },
  {
    question: "Posso usar meu próprio domínio?",
    answer: "No plano Pro você pode! Configure seu domínio (ex: shop.seudominio.com) e todos os seus links usarão sua marca. Fornecemos instruções passo a passo para configurar o DNS."
  }
]

export function FAQ() {
  return (
    <section className="py-20 px-4 bg-white" id="faq">
      <div className="container mx-auto max-w-4xl">
        {/* Cabeçalho */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-purple-600">❓ FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Tudo que você precisa saber sobre o LinkHub Pro
          </p>
        </motion.div>

        {/* Grid de FAQ */}
        <motion.div 
          className="bg-gray-50 rounded-2xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </motion.div>

        {/* Ainda tem dúvidas? */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-2">Ainda tem dúvidas?</h3>
            <p className="text-gray-600 mb-6">
              Nossa equipe está pronta para responder todas as suas perguntas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/contato">
                  <MessageCircle size={18} />
                  Chat ao Vivo
                </Link>
              </Button>
              <Button className="gap-2" asChild>
                <Link href="mailto:suporte@linkhub.pro">
                  <Mail size={18} />
                  Enviar Email
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
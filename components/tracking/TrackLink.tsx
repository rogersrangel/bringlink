"use client"

import { ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"

interface TrackLinkProps {
  children: ReactNode
  productId: string
  href: string
  className?: string
  onClick?: () => void
}

export function TrackLink({ children, productId, href, className, onClick }: TrackLinkProps) {
  const { user } = useAuth()

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Chamar o callback se existir
    if (onClick) {
      onClick()
    }

    // Registrar o clique se usuário estiver logado (dono do produto)
    if (user) {
      try {
        await fetch('/api/track-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            userId: user.id
          })
        })
      } catch (error) {
        console.error('Erro ao registrar clique:', error)
      }
    }

    // Abrir o link em nova aba
    window.open(href, '_blank')
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
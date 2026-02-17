"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface AuthCardProps {
  children: React.ReactNode
  title: string
  subtitle: string
  alternativeText: string
  alternativeLink: string
  alternativeLinkText: string
}

export function AuthCard({ 
  children, 
  title, 
  subtitle, 
  alternativeText, 
  alternativeLink, 
  alternativeLinkText 
}: AuthCardProps) {
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="block text-center mb-8">
          <span className="text-3xl font-bold">
            🔗 Bring<span className="text-purple-600">Link</span>
          </span>
        </Link>

        {/* Card */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {/* Título */}
          <h1 className="text-2xl font-bold text-center mb-2">{title}</h1>
          <p className="text-gray-600 text-center mb-8">{subtitle}</p>

          {children}

          {/* Link alternativo */}
          <p className="text-center text-gray-600 mt-6">
            {alternativeText}{" "}
            <Link 
              href={alternativeLink} 
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              {alternativeLinkText}
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
"use client"

import { motion } from "framer-motion"
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react"
import { useState } from "react"

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = [
    {
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:text-blue-600",
      label: "Facebook"
    },
    {
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "hover:text-blue-400",
      label: "Twitter"
    },
    {
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:text-blue-700",
      label: "LinkedIn"
    }
  ]

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map((link, index) => {
        const Icon = link.icon
        return (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 bg-gray-100 rounded-lg text-gray-600 ${link.color} transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Icon size={18} />
          </motion.a>
        )
      })}

      <motion.button
        onClick={handleCopyLink}
        className={`p-2 rounded-lg transition-colors ${
          copied ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {copied ? <Check size={18} /> : <Link2 size={18} />}
      </motion.button>
    </div>
  )
}
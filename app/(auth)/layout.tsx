import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Auth - BringLink",
  description: "Entre ou cadastre-se no BringLink",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {children}
    </div>
  )
}
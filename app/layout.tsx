import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Vamos usar Inter que é mais limpa
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster" // ← ADICIONE ESTA LINHA


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bringlink Pro - Sua vitrine de produtos afiliados",
  description: "Crie sua bio e vitrine de produtos em minutos e acompanhe cada clique em tempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}> {/* ← USAMOS INTER */}
        {children}
        <Toaster /> 
      </body>
    </html>
  );
}
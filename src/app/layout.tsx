import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AppProvider } from "@/src/contexts/AppContext"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Luxion - Fitness Profesional",
  description: "Plataforma profesional de fitness con entrenadores certificados",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}

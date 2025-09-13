import type React from "react"
import type { Metadata } from "next"
import { Poppins, Roboto } from "next/font/google"
import "./globals.css"

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "PRESIM - Simulador de préstamos",
  description: "Calcula cuánto ahorras refinanciando tu deuda",
  generator: "Next.js",
  icons:{
    icon: "/favicon.ico",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${roboto.variable} ${poppins.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}

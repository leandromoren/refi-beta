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
  title: "Simulador de Frascos | Ahorro e Inversión Inteligente",

  description: "Simula tus ahorros e inversiones con los frascos ficticios. Calcula el rendimiento, TNA y el plazo para alcanzar tus metas financieras de forma inteligente y organizada. ¡Empieza a simular hoy!",

  generator: "Next.js",

  keywords: ["simulador de frascos", "inversión", "ahorro", "Naranja X", "TNA", "rendimiento", "finanzas personales", "calculadora de inversión"],

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  openGraph: {
    title: "Simulador de Frascos | Ahorro e Inversión Inteligente",
    description: "Calcula el rendimiento, TNA y el plazo de tus ahorros. Crea frascos ficticios para organizar tu dinero de forma inteligente. ¡La herramienta ideal para tus finanzas personales!",
    url: "https://refisim.vercel.app", 
    siteName: "Simulador de Frascos",
    images: [
      {
        url: "https://refisim.vercel.app/og-image.png", // Crea una imagen de 1200x630 píxeles.
        width: 1200,
        height: 630,
        alt: "Simulador de Frascos | Ahorro e Inversión Inteligente",
      },
    ],
    locale: "es_AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Simulador de Frascos | Ahorro e Inversión Inteligente",
    description: "Calcula el rendimiento, TNA y el plazo de tus ahorros. Crea frascos ficticios para organizar tu dinero de forma inteligente. ¡La herramienta ideal para tus finanzas personales!",
    creator: "@leamorenn", 
    images: ["https://refisim.vercel.app/twitter-image.png"], // Crea una imagen de 1200x675 píxeles.
  },

  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://refisim.vercel.app", // Cambia esto por la URL de tu sitio.
  },
};

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

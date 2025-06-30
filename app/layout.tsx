import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bengaluru City Load Scale - CityPulse.AI",
  description:
    "Real-time city monitoring and AI-powered insights for Bengaluru. Traffic, infrastructure, and event monitoring powered by Gemini AI.",
  keywords: "Bengaluru, Bangalore, city monitoring, traffic, AI, Gemini, real-time, smart city, infrastructure",
  authors: [{ name: "CityPulse.AI Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Bengaluru City Load Scale - CityPulse.AI",
    description: "Real-time city monitoring and AI-powered insights for Bengaluru",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bengaluru City Load Scale - CityPulse.AI",
    description: "Real-time city monitoring and AI-powered insights for Bengaluru",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' fontSize='90'>🏙️</text></svg>"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

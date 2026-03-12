import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import ScrollToTop from "@/components/scroll-to-top"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Saqlein Shaikh - Portfolio",
  description: "Personal portfolio of Saqlein Shaikh - Mendix Developer at Deloitte",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}

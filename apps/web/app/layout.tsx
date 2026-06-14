import { Geist, Geist_Mono, Inter, Libre_Caslon_Text } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const libreCaslon = Libre_Caslon_Text({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Artisanal Hearth | Modern Flavors, Traditional Warmth",
  description: "Modern flavors, traditional warmth",
}

import { QueryProvider } from "@/components/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, inter.variable, libreCaslon.variable)}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

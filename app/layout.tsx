import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { FirebaseProvider } from "@/lib/firebase/firebase-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PrintXpro.com | Custom 3D Printed Models",
  description: "Premium custom-designed 3D printed models for all your needs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FirebaseProvider>
            <div className="flex min-h-screen flex-col w-full">
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

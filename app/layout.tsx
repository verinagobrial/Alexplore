import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif"
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans"
})

export const metadata: Metadata = {
  title: 'Alexplore | The Soul of the Mediterranean',
  description: 'Discover Alexandria, Egypt - explore ancient wonders, Mediterranean beauty, and unforgettable travel experiences with Alexplore.',
  generator: 'v0.app',
 icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
       url: '/alexandre-logo.png',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/alexandre-logo.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

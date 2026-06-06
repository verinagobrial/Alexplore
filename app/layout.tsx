import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });
const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'Luxor Alexandria - Luxury Hotel & Italian Restaurant',
  description: 'Experience luxury at Luxor Alexandria. Featuring an Italian restaurant, sky roof bar, spa, and world-class services in the heart of Alexandria, Egypt.',
  generator: 'v0.app',
  keywords: ['luxury hotel', 'Alexandria Egypt', 'Italian restaurant', 'sky roof bar', 'spa', 'resort'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Luxor Alexandria - Luxury Hotel & Italian Restaurant',
    description: 'Experience luxury at Luxor Alexandria in Egypt',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${_geist.variable} ${_geistMono.variable} ${_playfair.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

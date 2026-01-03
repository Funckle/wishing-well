import type { Metadata } from 'next'
import { Fraunces, Source_Sans_3 } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ThemeProvider } from '@/components/ThemeProvider'

// Display font - warm, characterful serif
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

// Body font - readable, friendly sans
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Wishing Well - Send and Receive Heartfelt Wishes',
  description: 'Open a wishing well during tough moments and receive thoughtful wishes from strangers. Or send coins of encouragement to those in need.',
  keywords: ['wishing well', 'encouragement', 'wishes', 'support', 'community'],
  openGraph: {
    title: 'Wishing Well',
    description: 'Send and receive heartfelt wishes during life\'s moments',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${sourceSans.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

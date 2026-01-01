import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'

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
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { LoginForm } from '@/components/auth/LoginForm'
import { Nav } from '@/components/Nav'
import { useAuth } from '@/components/auth/AuthProvider'

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <motion.div
          className="w-10 h-10 border-3 border-[var(--color-coral)] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <Nav />

      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          {/* Decorative header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-terracotta)] mb-4"
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-3xl">&#x1FAAB;</span>
            </motion.div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-2">
              Welcome back
            </h1>
            <p className="text-[var(--text-muted)]">
              Sign in to manage your wishing wells
            </p>
          </motion.div>

          {/* Login card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-organic p-8"
          >
            <LoginForm showTitle={false} />
          </motion.div>

          {/* Footer links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8 space-y-3"
          >
            <p className="text-sm text-[var(--text-muted)]">
              Don&apos;t have an account?{' '}
              <span className="text-[var(--color-coral)]">Sign in to create one!</span>
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-[var(--text-faded)]">
              <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
                Home
              </Link>
              <span>&#x2022;</span>
              <Link href="/how-it-works" className="hover:text-[var(--text-primary)] transition-colors">
                How it works
              </Link>
              <span>&#x2022;</span>
              <Link href="/explore" className="hover:text-[var(--text-primary)] transition-colors">
                Explore
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Top right pattern */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-[var(--color-coral)]/5 to-transparent" />
        {/* Bottom left pattern */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[var(--color-honey)]/5 to-transparent" />
        {/* Decorative dots */}
        <div className="absolute top-1/4 left-8 w-24 h-24 decorative-dots opacity-20 hidden lg:block" />
        <div className="absolute bottom-1/4 right-8 w-32 h-32 decorative-dots opacity-15 hidden lg:block" />
      </div>
    </main>
  )
}

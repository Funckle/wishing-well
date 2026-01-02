'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <Nav />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-stone-100">
        <LoginForm />
      </div>

      <p className="mt-6 text-stone-500 text-sm">
        Don&apos;t have an account?{' '}
        <span className="text-stone-700">
          Signing in will create one automatically.
        </span>
      </p>
    </main>
  )
}

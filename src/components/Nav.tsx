'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { useAuth } from '@/components/auth/AuthProvider'
import { NotificationBell } from '@/components/NotificationBell'

export function Nav() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isDashboard = pathname === '/dashboard'

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌟</span>
          <span className="font-bold text-xl text-stone-800">Wishing Well</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-stone-600 hover:text-stone-900 transition hidden sm:block">
            Explore
          </Link>
          <Link href="/leaderboard" className="text-stone-600 hover:text-stone-900 transition hidden sm:block">
            Leaderboard
          </Link>
          {user && <NotificationBell />}
          {user ? (
            isDashboard ? (
              <button
                onClick={handleSignOut}
                className="text-stone-500 hover:text-stone-700 transition text-sm"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            )
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { useAuth } from '@/components/auth/AuthProvider'
import { NotificationBell } from '@/components/NotificationBell'
import { useTheme } from '@/components/ThemeProvider'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <motion.button
      onClick={cycleTheme}
      className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--color-sand)] transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Theme: ${theme}`}
    >
      {theme === 'system' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ) : resolvedTheme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </motion.button>
  )
}

export function Nav() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isDashboard = pathname === '/dashboard'

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navLinks = [
    { href: '/explore', label: 'Explore' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-subtle)]" />

      <div className="relative max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.span
            className="text-2xl"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            &#x1FAAB;
          </motion.span>
          <span className="font-display font-semibold text-xl text-[var(--text-primary)] group-hover:text-[var(--color-terracotta)] transition-colors">
            Wishing Well
          </span>
        </Link>

        {/* Nav links & actions */}
        <div className="flex items-center gap-2">
          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[var(--color-terracotta)] bg-[var(--color-sand)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--color-sand)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-[var(--border-default)] mx-2" />

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          {user && <NotificationBell />}

          {/* Auth actions */}
          {user ? (
            isDashboard ? (
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--color-sand)] transition-colors"
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

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui'
import { Nav } from '@/components/Nav'
import { UsernameGenerator } from '@/components/UsernameGenerator'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { formatTimeRemaining, getWellUrl } from '@/lib/utils'
import type { Well } from '@/types/database'

// Stats card component
function StatCard({
  value,
  label,
  icon
}: {
  value: number | string
  label: string
  icon: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-[var(--color-sand)] flex items-center justify-center text-xl">
        <span dangerouslySetInnerHTML={{ __html: icon }} />
      </div>
      <div>
        <div className="font-display text-2xl font-semibold text-[var(--text-primary)]">{value}</div>
        <div className="text-sm text-[var(--text-muted)]">{label}</div>
      </div>
    </div>
  )
}

// Well card for dashboard
function WellCard({
  well,
  index,
  onCopyLink,
  onShare,
  isActive
}: {
  well: Well
  index: number
  onCopyLink: (code: string) => void
  onShare: (code: string) => void
  isActive: boolean
}) {
  const progress = (well.wish_count / well.wish_limit) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`card-organic p-6 ${!isActive ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[var(--text-primary)] font-medium mb-2 line-clamp-2">
            {well.context}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-sand)]/50 text-[var(--text-muted)]">
              <span>&#x1FAAB;</span>
              {well.wish_count}{isActive ? `/${well.wish_limit}` : ' wishes'}
            </span>
            {isActive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-blush)]/50 text-[var(--text-muted)]">
                <span>&#x23F1;&#xFE0F;</span>
                {formatTimeRemaining(well.expires_at)}
              </span>
            )}
            {!isActive && well.average_rating && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-honey)]/20 text-[var(--color-amber)]">
                <span>&#x2B50;</span>
                {well.average_rating.toFixed(1)} avg
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link href={`/well/${well.short_code}`}>
            <Button size="sm">{isActive ? 'View' : 'View'}</Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onShare(well.short_code)}
          >
            Share
          </Button>
        </div>
      </div>

      {isActive && (
        <div className="mt-4 w-full h-2 bg-[var(--color-sand)]/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--color-honey)] to-[var(--color-amber)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, isLoading: authLoading } = useAuth()
  const supabase = createClient()

  const [wells, setWells] = useState<Well[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState<string | null>(null)
  const [showUsernameGenerator, setShowUsernameGenerator] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchWells()
    }
  }, [user, authLoading, router])

  async function fetchWells() {
    try {
      const { data, error: fetchError } = await supabase
        .from('wells')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setWells(data || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch wells:', err)
      setError('Failed to load your wells. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(getWellUrl(code))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (authLoading || isLoading) {
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

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-8 px-4">
        <Nav />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-organic p-12 text-center"
          >
            <div className="text-5xl mb-4">&#x1F614;</div>
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
              Something went wrong
            </h2>
            <p className="text-[var(--text-muted)] mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </motion.div>
        </div>
      </main>
    )
  }

  const activeWells = wells.filter((w) => w.is_active)
  const closedWells = wells.filter((w) => !w.is_active)

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-12 px-4">
      <Nav />

      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-organic p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-terracotta)] flex items-center justify-center text-2xl text-white font-display font-bold shadow-lg">
              {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </div>

            {/* Name & Email */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                  {profile?.username || 'Anonymous Wisher'}
                </h1>
                <button
                  onClick={() => setShowUsernameGenerator(true)}
                  className="px-2.5 py-1 text-xs bg-[var(--color-sand)] hover:bg-[var(--color-coral)]/20 text-[var(--text-muted)] hover:text-[var(--color-coral)] rounded-full transition-colors"
                >
                  Change
                </button>
              </div>
              <p className="text-[var(--text-muted)]">{user?.email}</p>
            </div>

            {/* Points */}
            <StatCard
              value={profile?.total_points || 0}
              label="points earned"
              icon="&#x1F3C6;"
            />
          </div>

          {/* Unlocks */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                profile?.custom_wish_enabled
                  ? 'bg-[var(--color-moss)]/20 text-[var(--color-moss-deep)]'
                  : 'bg-[var(--color-sand)] text-[var(--text-faded)]'
              }`}
            >
              <span>&#x270D;&#xFE0F;</span>
              <span>Custom Wishes {profile?.custom_wish_enabled ? 'Unlocked' : '(100 pts)'}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link href="/create">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-terracotta)] rounded-2xl p-6 text-white cursor-pointer shadow-lg"
            >
              <div className="text-3xl mb-2">&#x2728;</div>
              <h2 className="font-display text-lg font-semibold">Open a New Well</h2>
              <p className="text-white/80 text-sm">Collect wishes from others</p>
            </motion.div>
          </Link>
          <Link href="/explore">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-[var(--color-honey)] to-[var(--color-amber)] rounded-2xl p-6 text-white cursor-pointer shadow-lg"
            >
              <div className="text-3xl">&#x1FAAB;</div>
              <h2 className="font-display text-lg font-semibold">Send Wishes</h2>
              <p className="text-white/80 text-sm">Earn points by helping others</p>
            </motion.div>
          </Link>
        </div>

        {/* Active Wells */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[var(--color-moss)]/20 flex items-center justify-center text-sm">&#x2705;</span>
            Active Wells ({activeWells.length})
          </h2>
          {activeWells.length === 0 ? (
            <div className="card-organic p-8 text-center">
              <p className="text-[var(--text-muted)]">No active wells. Create one to start collecting wishes!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeWells.map((well, index) => (
                <WellCard
                  key={well.id}
                  well={well}
                  index={index}
                  onCopyLink={copyToClipboard}
                  onShare={setShowShareModal}
                  isActive={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Closed Wells */}
        {closedWells.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[var(--color-sand)] flex items-center justify-center text-sm">&#x1F4DA;</span>
              Past Wells ({closedWells.length})
            </h2>
            <div className="space-y-4">
              {closedWells.map((well, index) => (
                <WellCard
                  key={well.id}
                  well={well}
                  index={index}
                  onCopyLink={copyToClipboard}
                  onShare={setShowShareModal}
                  isActive={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Copy notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-[var(--color-moss-deep)] text-white rounded-full text-sm shadow-lg"
          >
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Username Generator Modal */}
      <AnimatePresence>
        {showUsernameGenerator && (
          <UsernameGenerator
            currentUsername={profile?.username}
            onSave={async (username) => {
              const { error } = await supabase
                .from('profiles')
                .update({ username })
                .eq('id', user?.id)

              if (error) {
                return { error: new Error(error.message) }
              }

              window.location.reload()
              return { error: null }
            }}
            onClose={() => setShowUsernameGenerator(false)}
          />
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(null)}
          >
            <motion.div
              className="card-organic p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
                Share Your Well
              </h2>

              <div className="flex justify-center mb-6 p-4 bg-white rounded-xl">
                <QRCodeSVG value={getWellUrl(showShareModal)} size={140} />
              </div>

              {/* Link display */}
              <div className="mb-6">
                <div className="flex items-center gap-2 bg-[var(--color-sand)]/50 rounded-xl p-3">
                  <input
                    type="text"
                    readOnly
                    value={getWellUrl(showShareModal)}
                    className="flex-1 bg-transparent text-[var(--text-primary)] text-sm outline-none"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(getWellUrl(showShareModal))
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* Social share buttons */}
              <div className="mb-6">
                <p className="text-sm font-medium text-[var(--text-muted)] mb-3">Share on</p>
                <div className="grid grid-cols-4 gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Send me a wish! 🌟')}&url=${encodeURIComponent(getWellUrl(showShareModal))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[var(--color-sand)]/30 hover:bg-[var(--color-sand)] transition-colors"
                  >
                    <span className="text-xl">𝕏</span>
                    <span className="text-xs text-[var(--text-muted)]">Twitter</span>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getWellUrl(showShareModal))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[var(--color-sand)]/30 hover:bg-[var(--color-sand)] transition-colors"
                  >
                    <span className="text-xl">📘</span>
                    <span className="text-xs text-[var(--text-muted)]">Facebook</span>
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent('Send me a wish! 🌟 ' + getWellUrl(showShareModal))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[var(--color-sand)]/30 hover:bg-[var(--color-sand)] transition-colors"
                  >
                    <span className="text-xl">💬</span>
                    <span className="text-xs text-[var(--text-muted)]">WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent('Send me a wish!')}&body=${encodeURIComponent('Hey! I opened a wishing well and would love to receive your kind wishes. 🌟\n\n' + getWellUrl(showShareModal))}`}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[var(--color-sand)]/30 hover:bg-[var(--color-sand)] transition-colors"
                  >
                    <span className="text-xl">✉️</span>
                    <span className="text-xs text-[var(--text-muted)]">Email</span>
                  </a>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowShareModal(null)}
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

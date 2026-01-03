'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { Nav } from '@/components/Nav'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { formatTimeRemaining, getSentWellIds } from '@/lib/utils'
import type { Well } from '@/types/database'

// Well card component
function WellCard({ well, index }: { well: Well; index: number }) {
  const progress = (well.wish_count / well.wish_limit) * 100
  const spotsLeft = well.wish_limit - well.wish_count

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/well/${well.short_code}`}>
        <div className="card-organic p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Context */}
              <p className="text-[var(--text-primary)] font-medium mb-3 line-clamp-2 group-hover:text-[var(--color-terracotta)] transition-colors">
                {well.context}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-sand)]/50 text-[var(--text-muted)]">
                  <span>&#x1FAAB;</span>
                  {well.wish_count}/{well.wish_limit}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-blush)]/50 text-[var(--text-muted)]">
                  <span>&#x23F1;&#xFE0F;</span>
                  {formatTimeRemaining(well.expires_at)}
                </span>
                {spotsLeft <= 5 && spotsLeft > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-coral)]/10 text-[var(--color-coral)] text-xs font-medium">
                    {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left!
                  </span>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <Button size="sm" variant="secondary" className="group-hover:scale-105 transition-transform">
                Send Wish
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full h-2 bg-[var(--color-sand)]/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--color-honey)] to-[var(--color-amber)] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Empty state component
function EmptyState({
  icon,
  title,
  description,
  showCTA = true
}: {
  icon: string
  title: string
  description: string
  showCTA?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-organic p-12 text-center"
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h2>
      <p className="text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {showCTA && (
        <Link href="/create">
          <Button>Open a Well</Button>
        </Link>
      )}
    </motion.div>
  )
}

export default function ExplorePage() {
  const supabase = createClient()
  const { user } = useAuth()
  const [wells, setWells] = useState<Well[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sentWellIds, setSentWellIds] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Get sent well IDs
        if (user) {
          // Logged-in user - get from database
          const { data: sentWishes } = await supabase
            .from('wishes')
            .select('well_id')
            .eq('sender_id', user.id)

          if (sentWishes) {
            setSentWellIds(sentWishes.map((w: { well_id: string }) => w.well_id))
          }
        } else {
          // Anonymous user - get from localStorage
          setSentWellIds(getSentWellIds())
        }

        // Fetch active wells
        const { data, error: fetchError } = await supabase
          .from('wells')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(50)

        if (fetchError) throw fetchError
        setWells(data || [])
        setError(null)
      } catch (err) {
        console.error('Failed to fetch wells:', err)
        setError('Failed to load wells. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('wells-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wells' },
        () => {
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Filter out wells user has already sent to, and their own wells
  const availableWells = wells.filter((well) =>
    !sentWellIds.includes(well.id) && well.user_id !== user?.id
  )

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-12 px-4">
      <Nav />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-honey)] to-[var(--color-amber)] mb-4"
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
          >
            <span className="text-2xl">&#x1FAAB;</span>
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-2">
            Active Wishing Wells
          </h1>
          <p className="text-[var(--text-muted)]">
            Choose a well to send your heartfelt wishes
          </p>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <motion.div
              className="w-10 h-10 border-3 border-[var(--color-coral)] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : error ? (
          <EmptyState
            icon="&#x1F614;"
            title="Something went wrong"
            description={error}
            showCTA={false}
          />
        ) : wells.length === 0 ? (
          <EmptyState
            icon="&#x1F319;"
            title="No active wells right now"
            description="Be the first to open a wishing well and receive heartfelt wishes from others!"
          />
        ) : availableWells.length === 0 ? (
          <EmptyState
            icon="&#x2728;"
            title="You've sent wishes to all active wells!"
            description="Check back later for new wells, or open your own to receive wishes."
          />
        ) : (
          <div className="space-y-4">
            {availableWells.map((well, index) => (
              <WellCard key={well.id} well={well} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <hr className="divider-organic mb-8" />
          <p className="text-[var(--text-muted)] mb-4">Want to receive wishes yourself?</p>
          <Link href="/create">
            <Button icon="&#x2728;">Open Your Own Well</Button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { Nav } from '@/components/Nav'
import { createClient } from '@/lib/supabase/client'

interface LeaderboardEntry {
  id: string
  username: string | null
  avatar_url: string | null
  total_points: number
  rank: number
}

// Podium position component
function PodiumWinner({
  entry,
  place,
  delay
}: {
  entry: LeaderboardEntry
  place: 1 | 2 | 3
  delay: number
}) {
  const config = {
    1: {
      height: 'h-32',
      size: 'w-20 h-20',
      textSize: 'text-lg',
      pointsSize: 'text-2xl',
      medal: '&#x1F947;',
      gradient: 'from-[var(--color-honey)] to-[var(--color-amber)]',
      podiumGradient: 'from-[var(--color-honey)]/30 to-[var(--color-amber)]/20',
      glow: 'shadow-[0_0_40px_rgba(233,180,76,0.3)]',
      order: 'order-2',
    },
    2: {
      height: 'h-24',
      size: 'w-16 h-16',
      textSize: 'text-sm',
      pointsSize: 'text-xl',
      medal: '&#x1F948;',
      gradient: 'from-[var(--color-ink-faded)] to-[var(--color-ink-muted)]',
      podiumGradient: 'from-[var(--color-sand)] to-[var(--color-cream)]',
      glow: '',
      order: 'order-1',
    },
    3: {
      height: 'h-20',
      size: 'w-14 h-14',
      textSize: 'text-sm',
      pointsSize: 'text-lg',
      medal: '&#x1F949;',
      gradient: 'from-[var(--color-terracotta)] to-[var(--color-coral)]',
      podiumGradient: 'from-[var(--color-terracotta)]/20 to-[var(--color-coral)]/10',
      glow: '',
      order: 'order-3',
    },
  }

  const c = config[place]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className={`flex flex-col items-center ${c.order}`}
    >
      {/* Avatar with medal */}
      <div className="relative mb-3">
        <motion.div
          className={`${c.size} rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white font-display font-bold ${c.glow} border-4 border-[var(--bg-card)]`}
          whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
          transition={{ duration: 0.4 }}
        >
          <span className={c.textSize}>
            {entry.username?.[0]?.toUpperCase() || '?'}
          </span>
        </motion.div>
        {/* Medal badge */}
        <motion.span
          className="absolute -bottom-1 -right-1 text-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: 'spring' }}
          dangerouslySetInnerHTML={{ __html: c.medal }}
        />
      </div>

      {/* Name */}
      <p className={`font-display font-semibold text-[var(--text-primary)] ${c.textSize} truncate max-w-24 text-center`}>
        {entry.username || 'Anonymous'}
      </p>

      {/* Points */}
      <p className={`font-bold text-[var(--color-honey)] ${c.pointsSize}`}>
        {entry.total_points}
      </p>

      {/* Podium block */}
      <motion.div
        className={`${c.height} w-24 bg-gradient-to-b ${c.podiumGradient} rounded-t-2xl mt-3 border border-[var(--border-subtle)] border-b-0`}
        initial={{ height: 0 }}
        animate={{ height: c.height === 'h-32' ? 128 : c.height === 'h-24' ? 96 : 80 }}
        transition={{ delay: delay + 0.2, duration: 0.5, ease: 'easeOut' }}
      />
    </motion.div>
  )
}

// List item for rankings
function RankingRow({
  entry,
  index
}: {
  entry: LeaderboardEntry
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.03 }}
      className={`flex items-center gap-4 p-4 rounded-2xl transition-colors hover:bg-[var(--color-sand)]/50 ${
        entry.rank <= 3 ? 'bg-[var(--color-sand)]/30' : ''
      }`}
    >
      {/* Rank */}
      <div className="w-10 text-center">
        {entry.rank <= 3 ? (
          <span
            className="text-xl"
            dangerouslySetInnerHTML={{
              __html: entry.rank === 1 ? '&#x1F947;' : entry.rank === 2 ? '&#x1F948;' : '&#x1F949;'
            }}
          />
        ) : (
          <span className="font-display font-semibold text-[var(--text-muted)]">
            #{entry.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-terracotta)] flex items-center justify-center text-white font-semibold">
        {entry.username?.[0]?.toUpperCase() || '?'}
      </div>

      {/* Name */}
      <div className="flex-1">
        <p className="font-medium text-[var(--text-primary)]">
          {entry.username || 'Anonymous'}
        </p>
      </div>

      {/* Points */}
      <div className="text-right">
        <p className="font-bold text-[var(--color-honey)]">{entry.total_points}</p>
        <p className="text-xs text-[var(--text-faded)]">points</p>
      </div>
    </motion.div>
  )
}

export default function LeaderboardPage() {
  const supabase = createClient()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error: fetchError } = await supabase
          .from('leaderboard')
          .select('*')
          .limit(100)

        if (fetchError) throw fetchError
        setEntries(data || [])
        setError(null)
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
        setError('Failed to load leaderboard. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-12 px-4">
      <Nav />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-block text-4xl mb-4"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            &#x1F3C6;
          </motion.span>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-2">
            Leaderboard
          </h1>
          <p className="text-[var(--text-muted)]">
            The kindest wishers in our community
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <motion.div
              className="w-10 h-10 border-3 border-[var(--color-coral)] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-organic p-8 text-center"
          >
            <div className="text-5xl mb-4">&#x1F614;</div>
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
              Something went wrong
            </h2>
            <p className="text-[var(--text-muted)] mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </motion.div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-organic p-8 text-center"
          >
            <div className="text-5xl mb-4">&#x1F331;</div>
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
              No wishers yet!
            </h2>
            <p className="text-[var(--text-muted)] mb-6">
              Be the first to earn points by sending wishes.
            </p>
            <Link href="/explore">
              <Button>Start Wishing</Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Podium for top 3 */}
            {entries.length >= 3 && (
              <div className="flex items-end justify-center gap-4 mb-12 px-4">
                {entries[1] && (
                  <PodiumWinner entry={entries[1]} place={2} delay={0.2} />
                )}
                {entries[0] && (
                  <PodiumWinner entry={entries[0]} place={1} delay={0.1} />
                )}
                {entries[2] && (
                  <PodiumWinner entry={entries[2]} place={3} delay={0.3} />
                )}
              </div>
            )}

            {/* Full rankings list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card-organic overflow-hidden"
            >
              <div className="p-2">
                {entries.map((entry, index) => (
                  <RankingRow key={entry.id} entry={entry} index={index} />
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-[var(--text-muted)] mb-4">
            Want to climb the leaderboard?
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/explore">
              <Button variant="secondary">Send Wishes</Button>
            </Link>
            <Link href="/login">
              <Button>Create Account</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

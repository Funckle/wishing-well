'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

interface LeaderboardEntry {
  id: string
  username: string | null
  avatar_url: string | null
  total_points: number
  rank: number
}

export default function LeaderboardPage() {
  const supabase = createClient()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(100)

      if (!error && data) {
        setEntries(data)
      }
      setIsLoading(false)
    }

    fetchLeaderboard()
  }, [supabase])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return null
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-amber-400 to-yellow-500'
      case 2:
        return 'from-stone-300 to-stone-400'
      case 3:
        return 'from-amber-600 to-orange-500'
      default:
        return 'from-stone-100 to-stone-200'
    }
  }

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl">🌟</span>
            <span className="font-bold text-xl text-stone-800">Wishing Well</span>
          </Link>
          <h1 className="text-3xl font-bold text-stone-800 mb-3">
            🏆 Leaderboard
          </h1>
          <p className="text-stone-500">
            The kindest wishers in our community
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-xl font-semibold text-stone-800 mb-2">
              No wishers yet!
            </h2>
            <p className="text-stone-500 mb-6">
              Be the first to earn points by sending wishes.
            </p>
            <Link href="/explore">
              <Button>Start Wishing</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-4 mb-8 px-4">
              {/* 2nd place */}
              {entries[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-stone-300 to-stone-400 flex items-center justify-center text-2xl text-white font-bold mb-2 border-4 border-white shadow-lg">
                    {entries[1].username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="text-2xl mb-1">🥈</div>
                  <p className="font-semibold text-stone-800 text-sm truncate max-w-20">
                    {entries[1].username}
                  </p>
                  <p className="text-amber-500 font-bold">
                    {entries[1].total_points}
                  </p>
                  <div className="w-20 h-24 bg-gradient-to-b from-stone-200 to-stone-300 rounded-t-lg mt-2" />
                </motion.div>
              )}

              {/* 1st place */}
              {entries[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-3xl text-white font-bold mb-2 border-4 border-white shadow-lg">
                    {entries[0].username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="text-3xl mb-1">🥇</div>
                  <p className="font-bold text-stone-800 truncate max-w-24">
                    {entries[0].username}
                  </p>
                  <p className="text-amber-500 font-bold text-lg">
                    {entries[0].total_points}
                  </p>
                  <div className="w-24 h-32 bg-gradient-to-b from-amber-200 to-amber-300 rounded-t-lg mt-2" />
                </motion.div>
              )}

              {/* 3rd place */}
              {entries[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-xl text-white font-bold mb-2 border-4 border-white shadow-lg">
                    {entries[2].username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="text-xl mb-1">🥉</div>
                  <p className="font-semibold text-stone-800 text-sm truncate max-w-16">
                    {entries[2].username}
                  </p>
                  <p className="text-amber-500 font-bold text-sm">
                    {entries[2].total_points}
                  </p>
                  <div className="w-16 h-16 bg-gradient-to-b from-orange-200 to-orange-300 rounded-t-lg mt-2" />
                </motion.div>
              )}
            </div>

            {/* Full Leaderboard */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="divide-y divide-stone-100">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex items-center gap-4 p-4 ${
                      entry.rank <= 3 ? 'bg-gradient-to-r ' + getRankColor(entry.rank) + ' bg-opacity-10' : ''
                    }`}
                  >
                    <div className="w-10 text-center font-bold text-stone-500">
                      {getRankIcon(entry.rank) || `#${entry.rank}`}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold">
                      {entry.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-stone-800">
                        {entry.username || 'Anonymous'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-500">
                        {entry.total_points}
                      </p>
                      <p className="text-xs text-stone-400">points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-stone-500 mb-4">
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
        </div>
      </div>
    </main>
  )
}

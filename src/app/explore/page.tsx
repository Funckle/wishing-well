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
            setSentWellIds(sentWishes.map((w) => w.well_id))
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
  }, [supabase, user])

  return (
    <main className="min-h-screen pt-20 pb-8 px-4">
      <Nav />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-stone-800 mb-3">
            Active Wishing Wells
          </h1>
          <p className="text-stone-500">
            Choose a well to send your heartfelt wishes
          </p>
        </div>

        {(() => {
          // Filter out wells user has already sent to, and their own wells
          const availableWells = wells.filter((well) =>
            !sentWellIds.includes(well.id) && well.user_id !== user?.id
          )

          if (isLoading) {
            return (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full" />
              </div>
            )
          }

          if (wells.length === 0) {
            return (
              <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
                <div className="text-6xl mb-4">🌙</div>
                <h2 className="text-xl font-semibold text-stone-800 mb-2">
                  No active wells right now
                </h2>
                <p className="text-stone-500 mb-6">
                  Be the first to open a wishing well!
                </p>
                <Link href="/create">
                  <Button>Open a Well</Button>
                </Link>
              </div>
            )
          }

          if (availableWells.length === 0) {
            return (
              <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-xl font-semibold text-stone-800 mb-2">
                  You&apos;ve sent wishes to all active wells!
                </h2>
                <p className="text-stone-500 mb-6">
                  Check back later for new wells, or open your own.
                </p>
                <Link href="/create">
                  <Button>Open a Well</Button>
                </Link>
              </div>
            )
          }

          return (
            <div className="grid gap-4">
              {availableWells.map((well, index) => (
              <motion.div
                key={well.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/well/${well.short_code}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-stone-800 font-medium mb-2 line-clamp-2">
                          {well.context}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-stone-500">
                          <span className="flex items-center gap-1">
                            🪙 {well.wish_count}/{well.wish_limit} wishes
                          </span>
                          <span className="flex items-center gap-1">
                            ⏱️ {formatTimeRemaining(well.expires_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button size="sm" variant="secondary">
                          Send Wish
                        </Button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(well.wish_count / well.wish_limit) * 100}%`,
                        }}
                        transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            </div>
          )
        })()}

        <div className="text-center mt-12">
          <p className="text-stone-500 mb-4">Want to receive wishes yourself?</p>
          <Link href="/create">
            <Button>Open Your Own Well</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

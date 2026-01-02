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
import { formatTimeRemaining, getWellUrl, getEmbedCode } from '@/lib/utils'
import type { Well } from '@/types/database'

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, isLoading: authLoading, signOut } = useAuth()
  const supabase = createClient()

  const [wells, setWells] = useState<Well[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEmbedModal, setShowEmbedModal] = useState<string | null>(null)
  const [showUsernameGenerator, setShowUsernameGenerator] = useState(false)

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
    const { data, error } = await supabase
      .from('wells')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setWells(data)
    }
    setIsLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  const activeWells = wells.filter((w) => w.is_active)
  const closedWells = wells.filter((w) => !w.is_active)

  return (
    <main className="min-h-screen pt-20 pb-8 px-4">
      <Nav />
      <div className="max-w-4xl mx-auto">
        {/* Profile Stats */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-stone-100">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-2xl text-white font-bold">
              {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-stone-800">
                  {profile?.username || 'Anonymous Wisher'}
                </h1>
                <button
                  onClick={() => setShowUsernameGenerator(true)}
                  className="px-2 py-1 text-xs bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-600 rounded-full transition"
                >
                  Change
                </button>
              </div>
              <p className="text-stone-500">{user?.email}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-amber-500">
                {profile?.total_points || 0}
              </div>
              <div className="text-sm text-stone-500">points earned</div>
            </div>
          </div>

          {/* Unlocks */}
          <div className="mt-6 flex gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                profile?.gif_enabled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              <span>🎬</span>
              <span>GIFs {profile?.gif_enabled ? 'Unlocked' : '(50 pts)'}</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                profile?.custom_wish_enabled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              <span>✍️</span>
              <span>
                Custom Wishes {profile?.custom_wish_enabled ? 'Unlocked' : '(100 pts)'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/create">
            <div className="bg-gradient-to-r from-rose-400 to-pink-500 rounded-2xl p-6 text-white hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-2">✨</div>
              <h2 className="font-semibold text-lg">Open a New Well</h2>
              <p className="text-white/80 text-sm">Collect wishes from others</p>
            </div>
          </Link>
          <Link href="/explore">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl p-6 text-white hover:shadow-lg transition cursor-pointer">
              <div className="text-3xl mb-2">🪙</div>
              <h2 className="font-semibold text-lg">Send Wishes</h2>
              <p className="text-white/80 text-sm">Earn points by helping others</p>
            </div>
          </Link>
        </div>

        {/* Active Wells */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-stone-800 mb-4">
            Active Wells ({activeWells.length})
          </h2>
          {activeWells.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-stone-100">
              <p className="text-stone-500">No active wells. Create one to start collecting wishes!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeWells.map((well, index) => (
                <motion.div
                  key={well.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow border border-stone-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-stone-800 font-medium mb-2 line-clamp-2">
                        {well.context}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-stone-500">
                        <span className="flex items-center gap-1">
                          🪙 {well.wish_count}/{well.wish_limit}
                        </span>
                        <span className="flex items-center gap-1">
                          ⏱️ {formatTimeRemaining(well.expires_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/well/${well.short_code}`}>
                        <Button size="sm">View</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(getWellUrl(well.short_code))}
                      >
                        Copy Link
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
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Closed Wells */}
        {closedWells.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4">
              Past Wells ({closedWells.length})
            </h2>
            <div className="space-y-4">
              {closedWells.map((well, index) => (
                <motion.div
                  key={well.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow border border-stone-100 opacity-80"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-stone-700 mb-2 line-clamp-2">{well.context}</p>
                      <div className="flex items-center gap-4 text-sm text-stone-500">
                        <span className="flex items-center gap-1">
                          🪙 {well.wish_count} wishes
                        </span>
                        {well.average_rating && (
                          <span className="flex items-center gap-1">
                            ⭐ {well.average_rating.toFixed(1)} avg
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/well/${well.short_code}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowEmbedModal(well.short_code)}
                      >
                        Embed
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

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

              // Refresh the page to show updated username
              window.location.reload()
              return { error: null }
            }}
            onClose={() => setShowUsernameGenerator(false)}
          />
        )}
      </AnimatePresence>

      {/* Embed Modal */}
      {showEmbedModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowEmbedModal(null)}
        >
          <motion.div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-stone-800 mb-4">
              Embed Your Well
            </h2>

            <div className="flex justify-center mb-4">
              <QRCodeSVG value={getWellUrl(showEmbedModal)} size={120} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-600 mb-2">
                Embed Code
              </label>
              <textarea
                readOnly
                value={getEmbedCode(showEmbedModal)}
                className="w-full h-24 p-3 text-xs bg-stone-50 rounded-xl border border-stone-200 font-mono"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowEmbedModal(null)}
              >
                Close
              </Button>
              <Button
                className="flex-1"
                onClick={() => copyToClipboard(getEmbedCode(showEmbedModal))}
              >
                Copy Code
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  )
}

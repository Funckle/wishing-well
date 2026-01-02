'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Well, Coin, StarRating, Confetti, BackgroundScene } from '@/components/ui'
import { Nav } from '@/components/Nav'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'
import { formatTimeRemaining, hasAlreadySentToWell } from '@/lib/utils'
import type { Well as WellType, Wish } from '@/types/database'
import { WishComposer } from '@/components/WishComposer'
import { getBackgroundThemeById } from '@/lib/themes'

type PageParams = Promise<{ shortCode: string }>

export default function WellPage({ params }: { params: PageParams }) {
  const resolvedParams = use(params)
  const { shortCode } = resolvedParams
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()

  const [well, setWell] = useState<WellType | null>(null)
  const [wishes, setWishes] = useState<Wish[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showComposer, setShowComposer] = useState(false)
  const [currentWish, setCurrentWish] = useState<Wish | null>(null)
  const [showRating, setShowRating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isFishing, setIsFishing] = useState(false)
  const [hasAlreadySent, setHasAlreadySent] = useState(false)

  const isOwner = user?.id === well?.user_id

  useEffect(() => {
    async function fetchWell() {
      const { data: wellData, error: wellError } = await supabase
        .from('wells')
        .select('*')
        .eq('short_code', shortCode)
        .single()

      if (wellError) {
        setError('Well not found')
        setIsLoading(false)
        return
      }

      setWell(wellData)

      // Check if user has already sent to this well
      if (!user) {
        // Anonymous user - check localStorage
        setHasAlreadySent(hasAlreadySentToWell(wellData.id))
      } else if (user.id !== wellData.user_id) {
        // Logged-in user (not owner) - check database
        const { data: existingWish } = await supabase
          .from('wishes')
          .select('id')
          .eq('well_id', wellData.id)
          .eq('sender_id', user.id)
          .limit(1)
          .single()

        setHasAlreadySent(!!existingWish)
      }

      // Fetch wishes if owner
      if (user?.id === wellData.user_id) {
        const { data: wishesData } = await supabase
          .from('wishes')
          .select('*')
          .eq('well_id', wellData.id)
          .order('created_at', { ascending: false })

        if (wishesData) {
          setWishes(wishesData)
        }
      }

      setIsLoading(false)
    }

    fetchWell()

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`well-${shortCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wells',
          filter: `short_code=eq.${shortCode}`,
        },
        (payload: { new: WellType | null }) => {
          if (payload.new) {
            setWell(payload.new)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'wishes',
        },
        (payload: { new: Wish }) => {
          if (isOwner) {
            setWishes((prev) => [payload.new, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortCode, user?.id, isOwner])

  const handleFishCoin = async () => {
    const unviewedWish = wishes.find((w) => !w.is_viewed && w.rating === null)
    if (!unviewedWish) return

    setIsFishing(true)

    // Simulate fishing animation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setCurrentWish(unviewedWish)
    setShowRating(true)
    setIsFishing(false)
  }

  const handleRate = async (rating: number) => {
    if (!currentWish || !well) return

    // Update wish with rating
    await supabase
      .from('wishes')
      .update({
        rating,
        is_viewed: true,
        rated_at: new Date().toISOString(),
      })
      .eq('id', currentWish.id)

    // Add points to sender if they're registered and rating > 0
    if (currentWish.sender_id && rating > 0) {
      await supabase.rpc('add_points', {
        user_id: currentWish.sender_id,
        points: rating,
      })

      // Notify the sender about the rating
      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
      await supabase.from('notifications').insert({
        user_id: currentWish.sender_id,
        type: 'wish_rated',
        title: `Your wish received ${rating} star${rating !== 1 ? 's' : ''}!`,
        message: `${stars} (+${rating} points)`,
        data: { well_id: well.id, wish_id: currentWish.id, rating, short_code: shortCode },
      })
    }

    // Update well average rating (only for ratings > 0)
    if (rating > 0) {
      await supabase.rpc('update_well_rating', { well_id: well.id })
    }

    // Update local state
    setWishes((prev) =>
      prev.map((w) =>
        w.id === currentWish.id ? { ...w, rating, is_viewed: true } : w
      )
    )

    setShowRating(false)
    setCurrentWish(null)

    // Check if well is complete (all wishes rated with 1+ stars, excluding skipped)
    const ratedWishes = wishes.filter((w) => w.id === currentWish.id ? rating > 0 : (w.rating !== null && w.rating > 0))
    if (ratedWishes.length >= well.wish_limit) {
      setShowConfetti(true)
    }
  }

  const handleSkip = async () => {
    if (!currentWish || !well) return

    // Mark wish as skipped (rating: 0, no points, doesn't count)
    await supabase
      .from('wishes')
      .update({
        rating: 0,
        is_viewed: true,
        rated_at: new Date().toISOString(),
      })
      .eq('id', currentWish.id)

    // Update local state
    setWishes((prev) =>
      prev.map((w) =>
        w.id === currentWish.id ? { ...w, rating: 0, is_viewed: true } : w
      )
    )

    setShowRating(false)
    setCurrentWish(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !well) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Well Not Found</h1>
        <p className="text-stone-500 mb-6">This wishing well doesn&apos;t exist or has been removed.</p>
        <Link href="/explore">
          <Button>Browse Active Wells</Button>
        </Link>
      </main>
    )
  }

  const unviewedCount = wishes.filter((w) => !w.is_viewed).length
  // Count only wishes rated 1+ (not skipped with rating 0)
  const ratedCount = wishes.filter((w) => w.rating !== null && w.rating > 0).length
  const backgroundTheme = getBackgroundThemeById(well.background_theme)

  const pageContent = (
    <>
      <Nav />
      <Confetti isActive={showConfetti} />

      <div className="max-w-2xl mx-auto">
        {/* Well Display */}
        <Well
          context={well.context}
          wishCount={well.wish_count}
          wishLimit={well.wish_limit}
          isActive={well.is_active}
          averageRating={well.average_rating}
          wellTheme={well.well_theme}
          isOwner={isOwner}
          ratedCount={ratedCount}
          coins={wishes.map((w) => ({
            id: w.id,
            sentenceStarter: w.sentence_starter,
            descriptors: w.descriptors,
            outcome: w.outcome,
            emojis: w.emojis,
            customText: w.custom_text,
            gifUrl: w.gif_url,
            senderAvatar: null,
            rating: w.rating,
            isViewed: w.is_viewed,
            coinTheme: w.coin_theme,
          }))}
          onFishCoin={isOwner ? handleFishCoin : undefined}
          showFishButton={isOwner && unviewedCount > 0}
        />

        {/* Time remaining */}
        {well.is_active && (
          <div className="text-center mt-4 text-stone-500">
            <span className="text-sm">⏱️ {formatTimeRemaining(well.expires_at)}</span>
          </div>
        )}

        {/* Actions for visitors */}
        {!isOwner && well.is_active && (
          <div className="mt-8 text-center">
            {hasAlreadySent ? (
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-green-700 font-medium">You already sent a wish to this well!</p>
                <p className="text-green-600 text-sm mt-1">Your kindness has been received.</p>
                <Link href="/explore" className="inline-block mt-4">
                  <Button variant="outline" size="sm">
                    Find Another Well
                  </Button>
                </Link>
              </div>
            ) : (
              <Button size="lg" onClick={() => setShowComposer(true)} icon="🪙">
                Send a Wish
              </Button>
            )}
          </div>
        )}

        {/* Owner view - list of good wishes (3+ stars only) */}
        {isOwner && wishes.filter((w) => w.rating !== null && w.rating >= 3).length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-stone-800 mb-6">Your Wishes</h2>
            <div className="space-y-4">
              {wishes
                .filter((wish) => wish.rating !== null && wish.rating >= 3)
                .map((wish) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-4 shadow border border-stone-100"
                  >
                    <div className="flex items-start gap-4">
                      <Coin
                        wish={{
                          sentenceStarter: wish.sentence_starter,
                          descriptors: wish.descriptors,
                          outcome: wish.outcome,
                          emojis: wish.emojis,
                          customText: wish.custom_text,
                          gifUrl: wish.gif_url,
                        }}
                        coinTheme={wish.coin_theme}
                        size="sm"
                      />
                      <div className="flex-1">
                        <p className="text-stone-700">
                          {wish.custom_text ||
                            `${wish.sentence_starter} ${wish.descriptors.join(' + ')} ${wish.outcome}`}
                        </p>
                        {wish.emojis.length > 0 && (
                          <p className="text-lg mt-1">{wish.emojis.join(' ')}</p>
                        )}
                        <div className="mt-2">
                          <StarRating value={wish.rating} readonly size="sm" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Well closed message */}
        {!well.is_active && (
          <div className="mt-8 text-center bg-stone-50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-stone-800 mb-2">
              This well is closed
            </h2>
            <p className="text-stone-500">
              {well.wish_count >= well.wish_limit
                ? 'This well has collected all its wishes!'
                : 'This well has expired.'}
            </p>
            <Link href="/explore" className="inline-block mt-4">
              <Button variant="outline">Find Another Well</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Wish Composer Modal */}
      <AnimatePresence>
        {showComposer && (
          <WishComposer
            wellId={well.id}
            wellOwnerId={well.user_id}
            wellShortCode={shortCode}
            onClose={() => setShowComposer(false)}
            onSuccess={() => {
              setShowComposer(false)
              // Redirect to explore page after sending wish
              router.push('/explore')
            }}
          />
        )}
      </AnimatePresence>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRating && currentWish && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl my-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-center text-stone-800 mb-4">
                How does this wish make you feel?
              </h2>

              <div className="flex justify-center mb-4">
                <Coin
                  wish={{
                    sentenceStarter: currentWish.sentence_starter,
                    descriptors: currentWish.descriptors,
                    outcome: currentWish.outcome,
                    emojis: currentWish.emojis,
                    customText: currentWish.custom_text,
                    gifUrl: currentWish.gif_url,
                  }}
                  coinTheme={currentWish.coin_theme}
                  size="lg"
                />
              </div>

              <div className="bg-stone-50 rounded-xl p-4 mb-6">
                <p className="text-center text-stone-700">
                  {currentWish.custom_text ||
                    `${currentWish.sentence_starter} ${currentWish.descriptors.join(' + ')} ${currentWish.outcome}`.trim()}
                </p>
                {currentWish.emojis.length > 0 && (
                  <p className="text-center text-lg mt-2">
                    {currentWish.emojis.join(' ')}
                  </p>
                )}
              </div>

              {/* Rating section with explanation */}
              <div className="mb-6">
                <div className="flex justify-center mb-3">
                  <StarRating value={null} onChange={handleRate} size="lg" />
                </div>
                <p className="text-center text-xs text-stone-500">
                  <span className="font-medium">3-5 stars:</span> Saves to your collection
                  <br />
                  <span className="font-medium">1-2 stars:</span> Counts but won&apos;t be saved
                </p>
              </div>

              {/* Skip button with explanation */}
              <div className="border-t border-stone-100 pt-4">
                <Button
                  variant="ghost"
                  className="w-full text-stone-500"
                  onClick={handleSkip}
                >
                  Skip this wish
                </Button>
                <p className="text-center text-xs text-stone-400 mt-2">
                  Removes the wish entirely — it won&apos;t count or be saved
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )

  // Wrap in BackgroundScene if there's a background theme
  if (backgroundTheme) {
    return (
      <BackgroundScene theme={backgroundTheme}>
        <main className="min-h-screen pt-20 pb-8 px-4">
          {pageContent}
        </main>
      </BackgroundScene>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-8 px-4">
      {pageContent}
    </main>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
  Textarea,
  TokenSelector,
  Coin,
  CoinTossAnimation,
  SENTENCE_STARTERS,
  DESCRIPTORS,
  OUTCOMES,
  EMOJIS,
  getTokenLabel,
} from '@/components/ui'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'

interface WishComposerProps {
  wellId: string
  onClose: () => void
  onSuccess: () => void
}

export function WishComposer({ wellId, onClose, onSuccess }: WishComposerProps) {
  const { user, profile } = useAuth()
  const supabase = createClient()

  const [sentenceStarter, setSentenceStarter] = useState<string[]>([])
  const [descriptors, setDescriptors] = useState<string[]>([])
  const [outcome, setOutcome] = useState<string[]>([])
  const [emojis, setEmojis] = useState<string[]>([])
  const [customText, setCustomText] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [gifUrl, setGifUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showToss, setShowToss] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const canUseCustom = profile?.custom_wish_enabled ?? false
  const canUseGif = profile?.gif_enabled ?? false

  const wishText = useCustom
    ? customText
    : `${getTokenLabel(SENTENCE_STARTERS, sentenceStarter[0] || '')} ${descriptors
        .map((d) => getTokenLabel(DESCRIPTORS, d))
        .join(' + ')} ${getTokenLabel(OUTCOMES, outcome[0] || '')}`.trim()

  const emojiLabels = emojis.map((e) => getTokenLabel(EMOJIS, e))

  const isValid = useCustom
    ? customText.trim().length >= 5
    : sentenceStarter.length > 0 && descriptors.length > 0 && outcome.length > 0

  const handleSubmit = async () => {
    if (!isValid) return

    setIsLoading(true)
    setError(null)

    try {
      // Check rate limit
      const response = await fetch('/api/wish/check-rate-limit')
      const { allowed } = await response.json()

      if (!allowed) {
        setError('You can only send 5 wishes per hour. Please try again later.')
        setIsLoading(false)
        return
      }

      // Create wish
      const { error: insertError } = await supabase.from('wishes').insert({
        well_id: wellId,
        sender_id: user?.id || null,
        sentence_starter: getTokenLabel(SENTENCE_STARTERS, sentenceStarter[0] || ''),
        descriptors: descriptors.map((d) => getTokenLabel(DESCRIPTORS, d)),
        outcome: getTokenLabel(OUTCOMES, outcome[0] || ''),
        emojis: emojiLabels,
        custom_text: useCustom ? customText.trim() : null,
        gif_url: gifUrl,
      })

      if (insertError) throw insertError

      // Increment wish count
      await supabase.rpc('increment_wish_count', { well_id: wellId })

      // Show toss animation
      setShowToss(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send wish')
      setIsLoading(false)
    }
  }

  const handleTossComplete = () => {
    setShowToss(false)
    setShowSuccess(true)
    setTimeout(() => {
      onSuccess()
    }, 2000)
  }

  if (showSuccess) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-6xl mb-4"
          >
            ✨
          </motion.div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            Your coin is in the well!
          </h2>
          <p className="text-stone-500">
            Thank you for spreading kindness
          </p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {showToss && (
          <CoinTossAnimation
            wish={{
              sentenceStarter: getTokenLabel(SENTENCE_STARTERS, sentenceStarter[0] || ''),
              descriptors: descriptors.map((d) => getTokenLabel(DESCRIPTORS, d)),
              outcome: getTokenLabel(OUTCOMES, outcome[0] || ''),
              emojis: emojiLabels,
              customText: useCustom ? customText : null,
              gifUrl,
            }}
            onComplete={handleTossComplete}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl my-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-800">Compose Your Wish</h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition"
            >
              ✕
            </button>
          </div>

          {/* Toggle custom wish */}
          {canUseCustom && (
            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUseCustom(!useCustom)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  useCustom ? 'bg-rose-400' : 'bg-stone-200'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    useCustom ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-stone-600">
                Write a custom wish (unlocked at 100 points!)
              </span>
            </div>
          )}

          {useCustom ? (
            <div className="mb-6">
              <Textarea
                label="Your custom wish"
                placeholder="Write something heartfelt..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                maxLength={150}
                showCount
                rows={3}
              />
            </div>
          ) : (
            <div className="space-y-6 mb-6">
              <TokenSelector
                title="Start with..."
                tokens={SENTENCE_STARTERS}
                selected={sentenceStarter}
                onChange={setSentenceStarter}
                maxSelect={1}
              />

              <TokenSelector
                title="Add some descriptors"
                tokens={DESCRIPTORS}
                selected={descriptors}
                onChange={setDescriptors}
                maxSelect={2}
              />

              <TokenSelector
                title="End with encouragement"
                tokens={OUTCOMES}
                selected={outcome}
                onChange={setOutcome}
                maxSelect={1}
              />
            </div>
          )}

          <TokenSelector
            title="Add emojis"
            tokens={EMOJIS}
            selected={emojis}
            onChange={setEmojis}
            maxSelect={5}
          />

          {/* GIF picker placeholder */}
          {canUseGif && (
            <div className="mt-6">
              <p className="text-sm text-stone-500 mb-2">
                🎁 You&apos;ve unlocked GIFs! (Coming soon)
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="mt-6 mb-6">
            <p className="text-sm font-medium text-stone-600 mb-3">Preview:</p>
            <div className="flex justify-center">
              <Coin
                wish={{
                  sentenceStarter: getTokenLabel(SENTENCE_STARTERS, sentenceStarter[0] || ''),
                  descriptors: descriptors.map((d) => getTokenLabel(DESCRIPTORS, d)),
                  outcome: getTokenLabel(OUTCOMES, outcome[0] || ''),
                  emojis: emojiLabels,
                  customText: useCustom ? customText : null,
                  gifUrl,
                }}
                size="lg"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm mb-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!isValid}
              className="flex-1"
              icon="🪙"
            >
              Toss Coin
            </Button>
          </div>

          {!user && (
            <p className="text-center text-stone-400 text-xs mt-4">
              Sending anonymously.{' '}
              <a href="/login" className="text-rose-500 hover:underline">
                Sign in
              </a>{' '}
              to earn points and unlock rewards.
            </p>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Coin } from './Coin'

interface WellProps {
  context: string
  wishCount: number
  wishLimit: number
  isActive: boolean
  averageRating?: number | null
  coins?: Array<{
    id: string
    sentenceStarter: string
    descriptors: string[]
    outcome: string
    emojis: string[]
    customText?: string | null
    gifUrl?: string | null
    senderAvatar?: string | null
    rating?: number | null
    isViewed: boolean
  }>
  onFishCoin?: () => void
  showFishButton?: boolean
}

export function Well({
  context,
  wishCount,
  wishLimit,
  isActive,
  averageRating,
  coins = [],
  onFishCoin,
  showFishButton = false,
}: WellProps) {
  const [isFishing, setIsFishing] = useState(false)
  const progress = (wishCount / wishLimit) * 100

  const handleFish = () => {
    if (onFishCoin && !isFishing) {
      setIsFishing(true)
      setTimeout(() => {
        onFishCoin()
        setIsFishing(false)
      }, 1500)
    }
  }

  const unviewedCount = coins.filter(c => !c.isViewed).length

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Well structure */}
      <div className="relative">
        {/* Well opening (top view) */}
        <div className="relative mx-auto w-64 h-64">
          {/* Outer stone ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-stone-400 to-stone-600 shadow-2xl" />

          {/* Inner dark water area */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-b from-blue-900 to-slate-900 overflow-hidden">
            {/* Water surface effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-800/30 via-transparent to-blue-600/20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Coins at bottom of well */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1 max-w-[80%]">
              {coins.slice(0, 12).map((coin, i) => (
                <motion.div
                  key={coin.id}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow"
                />
              ))}
              {wishCount > 12 && (
                <span className="text-xs text-amber-300/70">+{wishCount - 12}</span>
              )}
            </div>

            {/* Fishing animation */}
            <AnimatePresence>
              {isFishing && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2"
                  initial={{ y: -100 }}
                  animate={{ y: [0, 80, 0] }}
                  exit={{ y: -100 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-20 bg-stone-400" />
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.3, repeat: 3 }}
                    >
                      <Coin
                        wish={{
                          sentenceStarter: '',
                          descriptors: [],
                          outcome: '',
                          emojis: ['✨'],
                        }}
                        size="sm"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sparkle effects */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-xs"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>

          {/* Stone texture details */}
          <div className="absolute inset-0 rounded-full pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-8 h-4 bg-stone-500 rounded-sm opacity-50"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-115px)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 w-full max-w-xs mx-auto">
          <div className="flex justify-between text-sm text-stone-600 mb-1">
            <span>{wishCount} coins collected</span>
            <span>{wishLimit} needed</span>
          </div>
          <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Fish button */}
        {showFishButton && unviewedCount > 0 && (
          <motion.button
            className="mt-6 mx-auto block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium shadow-lg disabled:opacity-50"
            onClick={handleFish}
            disabled={isFishing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFishing ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  🎣
                </motion.span>
                Fishing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                🎣 Fish out a coin ({unviewedCount} waiting)
              </span>
            )}
          </motion.button>
        )}

        {/* Status badges */}
        <div className="mt-4 flex justify-center gap-2">
          {isActive ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✨ Active
            </span>
          ) : (
            <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-sm font-medium">
              Closed
            </span>
          )}
          {averageRating && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium flex items-center gap-1">
              <span>★</span>
              {averageRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Context card */}
      <div className="mt-8 p-4 bg-white rounded-2xl shadow-lg border border-stone-100">
        <h3 className="text-sm font-medium text-stone-500 mb-2">What this well is for:</h3>
        <p className="text-stone-800">{context}</p>
      </div>
    </div>
  )
}

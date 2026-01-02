'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Coin } from './Coin'
import { getWellThemeById, type WellTheme } from '@/lib/themes'

interface WellProps {
  context: string
  wishCount: number
  wishLimit: number
  isActive: boolean
  averageRating?: number | null
  wellTheme?: string | null
  isOwner?: boolean
  ratedCount?: number
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
    coinTheme?: string | null
  }>
  onFishCoin?: () => void
  showFishButton?: boolean
}

// Well SVG component with theme support
function WellSVG({
  className = '',
  coinCount = 0,
  theme,
}: {
  className?: string
  coinCount?: number
  theme: WellTheme
}) {
  const c = theme.colors

  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Grass/ground base */}
      <path fill={c.grass} d="M84.081,167.302c-4.662,0-8.44,3.779-8.44,8.44v42.481H64.974c-4.662,0-8.44,3.779-8.44,8.44s3.778,8.44,8.44,8.44h19.107c4.662,0,8.44-3.779,8.44-8.44v-42.481h297.187v-16.879H84.081z"/>

      {/* Roof poles */}
      <polygon fill={c.poles} points="405.357,100.318 405.357,145.329 391.905,167.835 378.452,145.329 378.452,100.318"/>
      <polygon fill={c.poles} points="161.094,100.318 161.094,145.329 147.647,167.835 134.2,145.329 134.2,100.318"/>

      {/* Support beams */}
      <rect x="378.452" y="145.329" fill={c.polesAccent} width="26.905" height="162.107"/>
      <rect x="134.2" y="145.329" fill={c.polesAccent} width="26.894" height="162.107"/>

      {/* Rope/handle */}
      <path fill={c.rope} d="M320.41,327.124c-4.662,0-8.44-3.779-8.44-8.44V164.29c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44v154.394C328.85,323.345,325.072,327.124,320.41,327.124z"/>

      {/* Roof */}
      <polygon fill={c.roofAccent} points="429.157,0 455.466,111.571 421.707,111.571 364.466,55.785 395.398,0"/>
      <polygon fill={c.roof} points="395.398,0 421.707,111.571 84.08,111.571 110.389,0"/>

      {/* Roof decorations */}
      <path fill={c.roofAccent} d="M276.852,61.411c-13.96,0-25.319-11.357-25.319-25.319c0-4.661,3.778-8.44,8.44-8.44c4.662,0,8.44,3.779,8.44,8.44c0,4.654,3.785,8.44,8.44,8.44c4.654,0,8.44-3.785,8.44-8.44c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44C302.171,50.052,290.812,61.411,276.852,61.411z"/>
      <path fill={c.roofAccent} d="M355.621,83.916c-13.96,0-25.319-11.357-25.319-25.319c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44c0,4.654,3.785,8.44,8.44,8.44s8.44-3.785,8.44-8.44c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44C380.94,72.558,369.581,83.916,355.621,83.916z"/>

      {/* Well base */}
      <polygon fill={c.baseAccent} points="131.949,340.362 131.949,385.373 373.849,512 407.608,512 407.608,340.362"/>
      <rect x="131.949" y="385.373" fill={c.base} width="241.9" height="126.627"/>

      {/* Well rim */}
      <polygon fill={c.rimAccent} points="419.266,296.184 419.266,351.615 385.507,351.615 363.002,323.899 385.507,296.184"/>
      <rect x="120.28" y="296.184" fill={c.rim} width="265.227" height="55.431"/>

      {/* Handle details */}
      <path fill={c.rope} d="M269.773,195.634c-4.662,0-8.44-3.779-8.44-8.44V164.29c0-4.661,3.778-8.44,8.44-8.44c4.662,0,8.44,3.779,8.44,8.44v22.904C278.212,191.855,274.435,195.634,269.773,195.634z"/>
      <path fill={c.rope} d="M295.091,195.634c-4.662,0-8.44-3.779-8.44-8.44V164.29c0-4.661,3.778-8.44,8.44-8.44c4.662,0,8.44,3.779,8.44,8.44v22.904C303.531,191.855,299.754,195.634,295.091,195.634z"/>
      <path fill={c.rope} d="M244.454,195.634c-4.662,0-8.44-3.779-8.44-8.44V164.29c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44v22.904C252.894,191.855,249.116,195.634,244.454,195.634z"/>
      <path fill={c.rope} d="M219.135,195.634c-4.662,0-8.44-3.779-8.44-8.44V164.29c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44v22.904C227.575,191.855,223.797,195.634,219.135,195.634z"/>

      {/* Coins in well - dynamic based on count */}
      {coinCount > 0 && <circle fill={c.poles} cx="200" cy="465" r="12"/>}
      {coinCount > 1 && <circle fill={c.poles} cx="327" cy="445" r="12"/>}
      {coinCount > 2 && <circle fill={c.poles} cx="178" cy="440" r="12"/>}
      {coinCount > 3 && <circle fill={c.polesAccent} cx="250" cy="470" r="10"/>}
      {coinCount > 4 && <circle fill={c.polesAccent} cx="300" cy="475" r="10"/>}
      {coinCount > 5 && <circle fill={c.baseAccent} cx="225" cy="455" r="8"/>}
    </svg>
  )
}

export function Well({
  context,
  wishCount,
  wishLimit,
  isActive,
  averageRating,
  wellTheme,
  isOwner = false,
  ratedCount = 0,
  coins = [],
  onFishCoin,
  showFishButton = false,
}: WellProps) {
  const [isFishing, setIsFishing] = useState(false)
  // For owner: show rated progress. For visitor: show received progress
  const displayCount = isOwner ? ratedCount : wishCount
  const progress = (displayCount / wishLimit) * 100
  const theme = getWellThemeById(wellTheme)

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
        {/* SVG Well illustration */}
        <div className="relative mx-auto w-72 h-72">
          <WellSVG
            className="w-full h-full drop-shadow-xl"
            coinCount={Math.min(wishCount, 6)}
            theme={theme}
          />

          {/* Sparkle effects overlay */}
          {isActive && [...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg pointer-events-none"
              style={{
                left: `${30 + i * 12}%`,
                top: `${65 + (i % 2) * 10}%`,
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
              }}
            >
              ✨
            </motion.div>
          ))}

          {/* Fishing animation overlay */}
          <AnimatePresence>
            {isFishing && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: '30%' }}
                initial={{ y: -50 }}
                animate={{ y: [0, 60, 0] }}
                exit={{ y: -50 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-16 bg-stone-600" />
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
        </div>

        {/* Progress indicator */}
        <div className="mt-6 w-full max-w-xs mx-auto">
          <div className="flex justify-between text-sm text-stone-600 mb-1">
            {isOwner ? (
              <>
                <span>{ratedCount} wishes opened</span>
                <span>{wishLimit} total</span>
              </>
            ) : (
              <>
                <span>{wishCount}/{wishLimit} wishes</span>
                <span>{wishCount >= wishLimit ? 'Full!' : `${wishLimit - wishCount} spots left`}</span>
              </>
            )}
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

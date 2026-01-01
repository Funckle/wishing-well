'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface CoinProps {
  wish: {
    sentenceStarter: string
    descriptors: string[]
    outcome: string
    emojis: string[]
    customText?: string | null
    gifUrl?: string | null
    senderAvatar?: string | null
    rating?: number | null
  }
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  isFlipped?: boolean
  className?: string
}

export function Coin({ wish, size = 'md', onClick, isFlipped = false, className = '' }: CoinProps) {
  const [flipped, setFlipped] = useState(isFlipped)

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }

  const textSizes = {
    sm: 'text-[8px]',
    md: 'text-xs',
    lg: 'text-sm',
  }

  const wishText = wish.customText ||
    `${wish.sentenceStarter} ${wish.descriptors.join(' + ')} ${wish.outcome}`.trim()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      setFlipped(!flipped)
    }
  }

  return (
    <div
      className={`perspective-1000 cursor-pointer ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of coin - wish text */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-lg border-4 border-amber-600 flex items-center justify-center p-2 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`text-center ${textSizes[size]} text-amber-900 font-medium leading-tight`}>
            <p className="break-words">{wishText}</p>
            {wish.emojis.length > 0 && (
              <p className="mt-1">{wish.emojis.join(' ')}</p>
            )}
          </div>
          {/* Coin edge decoration */}
          <div className="absolute inset-1 rounded-full border border-amber-400/50" />
          <div className="absolute inset-2 rounded-full border border-amber-300/30" />
        </div>

        {/* Back of coin - avatar or pattern */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-lg border-4 border-amber-700 flex items-center justify-center backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {wish.senderAvatar ? (
            <img
              src={wish.senderAvatar}
              alt="Sender"
              className="w-3/4 h-3/4 rounded-full object-cover"
            />
          ) : (
            <div className="w-3/4 h-3/4 rounded-full bg-amber-700/30 flex items-center justify-center">
              <span className="text-amber-100 text-2xl">✨</span>
            </div>
          )}
          {/* Coin edge decoration */}
          <div className="absolute inset-1 rounded-full border border-amber-500/50" />
          <div className="absolute inset-2 rounded-full border border-amber-400/30" />
        </div>
      </motion.div>

      {/* Rating stars if rated */}
      {wish.rating !== null && wish.rating !== undefined && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < wish.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function CoinTossAnimation({
  wish,
  onComplete
}: {
  wish: CoinProps['wish']
  onComplete?: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 200, scale: 1, rotateY: 0 }}
        animate={{
          y: [-200, -400, 200],
          scale: [1, 0.8, 0.5],
          rotateY: [0, 720, 1440],
        }}
        transition={{
          duration: 2,
          ease: 'easeOut',
          times: [0, 0.5, 1],
        }}
        onAnimationComplete={onComplete}
      >
        <Coin wish={wish} size="lg" />
      </motion.div>

      {/* Splash effect at the end */}
      <motion.div
        className="absolute bottom-1/3"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        <div className="text-6xl">💦</div>
      </motion.div>
    </motion.div>
  )
}

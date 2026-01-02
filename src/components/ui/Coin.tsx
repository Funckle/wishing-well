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

// SVG Coin component - simplified gold coin
function CoinSVG({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow layer */}
      <circle fill="#D97706" cx="18" cy="19" r="17" />
      {/* Main gold body */}
      <circle fill="#FBBF24" cx="18" cy="17" r="17" />
      {/* Inner gold highlight */}
      <circle fill="#FCD34D" cx="18" cy="17" r="14" />
      {/* Subtle inner ring */}
      <circle fill="none" stroke="#D97706" strokeWidth="0.5" cx="18" cy="17" r="13" />
      {/* Outer rim highlight */}
      <circle fill="none" stroke="#FDE68A" strokeWidth="0.8" cx="18" cy="17" r="15.5" opacity="0.5" />
    </svg>
  )
}

// SVG for back of coin with star pattern
function CoinBackSVG({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shadow layer */}
      <circle fill="#B45309" cx="18" cy="19" r="17" />
      {/* Main gold body - slightly darker for back */}
      <circle fill="#F59E0B" cx="18" cy="17" r="17" />
      {/* Inner area */}
      <circle fill="#FBBF24" cx="18" cy="17" r="14" />
      {/* Decorative star pattern */}
      <path
        fill="#D97706"
        d="M18 8 L19.5 14 L26 14 L21 18 L23 25 L18 21 L13 25 L15 18 L10 14 L16.5 14 Z"
        opacity="0.6"
      />
      {/* Inner ring */}
      <circle fill="none" stroke="#92400E" strokeWidth="0.5" cx="18" cy="17" r="13" />
      {/* Outer rim */}
      <circle fill="none" stroke="#FCD34D" strokeWidth="0.8" cx="18" cy="17" r="15.5" opacity="0.5" />
    </svg>
  )
}

export function Coin({ wish, size = 'md', onClick, isFlipped = false, className = '' }: CoinProps) {
  const [flipped, setFlipped] = useState(isFlipped)

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }

  const textSizes = {
    sm: 'text-[8px] leading-[1.2]',
    md: 'text-xs leading-tight',
    lg: 'text-sm leading-tight',
  }

  const paddingSizes = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  }

  const wishText = wish.customText ||
    `${wish.sentenceStarter} ${wish.descriptors.join(' and ')} ${wish.outcome}`.trim()

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
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* SVG coin background */}
          <CoinSVG className="absolute inset-0 w-full h-full drop-shadow-lg" />
          {/* Text overlay */}
          <div className={`absolute inset-0 flex items-center justify-center ${paddingSizes[size]}`}>
            <div className={`text-center ${textSizes[size]} text-amber-900 font-medium`}>
              <p className="break-words line-clamp-4">{wishText}</p>
              {wish.emojis.length > 0 && (
                <p className="mt-1">{wish.emojis.join(' ')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Back of coin - avatar or pattern */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* SVG coin background */}
          <CoinBackSVG className="absolute inset-0 w-full h-full drop-shadow-lg" />
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {wish.senderAvatar ? (
              <img
                src={wish.senderAvatar}
                alt="Sender"
                className="w-1/2 h-1/2 rounded-full object-cover border-2 border-amber-600"
              />
            ) : (
              <span className="text-2xl">✨</span>
            )}
          </div>
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

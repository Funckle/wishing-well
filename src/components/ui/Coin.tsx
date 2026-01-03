'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { getCoinThemeById, type CoinTheme } from '@/lib/themes'

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
  coinTheme?: string | null
  onClick?: () => void
  isFlipped?: boolean
  className?: string
}

// Get gradient colors based on theme
function getThemeGradient(theme: CoinTheme) {
  const gradients: Record<string, { from: string; via: string; to: string; glow: string }> = {
    gold: {
      from: 'var(--color-honey, #E9B44C)',
      via: 'var(--color-amber, #D4930D)',
      to: 'var(--color-gold, #C9A227)',
      glow: 'rgba(233, 180, 76, 0.3)',
    },
    silver: {
      from: '#D1D5DB',
      via: '#9CA3AF',
      to: '#6B7280',
      glow: 'rgba(156, 163, 175, 0.3)',
    },
    bronze: {
      from: '#D97706',
      via: '#B45309',
      to: '#92400E',
      glow: 'rgba(217, 119, 6, 0.3)',
    },
    'rose-gold': {
      from: '#F472B6',
      via: '#EC4899',
      to: '#DB2777',
      glow: 'rgba(244, 114, 182, 0.3)',
    },
    crystal: {
      from: '#A5B4FC',
      via: '#818CF8',
      to: '#6366F1',
      glow: 'rgba(129, 140, 248, 0.3)',
    },
  }
  return gradients[theme.id] || gradients.gold
}

export function Coin({
  wish,
  size = 'md',
  coinTheme,
  onClick,
  isFlipped = false,
  className = '',
}: CoinProps) {
  const [flipped, setFlipped] = useState(isFlipped)
  const theme = getCoinThemeById(coinTheme)
  const gradient = getThemeGradient(theme)

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

  const ringInset = {
    sm: 'inset-1.5',
    md: 'inset-2',
    lg: 'inset-3',
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
          <div className="relative w-full h-full">
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: gradient.glow }}
            />

            {/* Coin body with gradient */}
            <div
              className="absolute inset-0 rounded-full shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.via} 50%, ${gradient.to} 100%)`,
              }}
            />

            {/* Inner ring */}
            <div
              className={`absolute ${ringInset[size]} rounded-full border-2 opacity-40`}
              style={{ borderColor: gradient.to }}
            />

            {/* Highlight overlay */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
              }}
            />

            {/* Text content */}
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <div className={`text-center ${textSizes[size]} font-medium ${theme.colors.textColor}`}>
                <p className="break-words line-clamp-4">{wishText}</p>
                {wish.emojis.length > 0 && (
                  <p className="mt-1">{wish.emojis.join(' ')}</p>
                )}
              </div>
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
          <div className="relative w-full h-full">
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: gradient.glow }}
            />

            {/* Coin body - slightly darker for back */}
            <div
              className="absolute inset-0 rounded-full shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${gradient.via} 0%, ${gradient.to} 50%, ${gradient.to} 100%)`,
              }}
            />

            {/* Inner ring */}
            <div
              className={`absolute ${ringInset[size]} rounded-full border-2 opacity-40`}
              style={{ borderColor: gradient.from }}
            />

            {/* Star pattern overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-1/2 h-1/2 opacity-30">
                <path
                  fill={gradient.from}
                  d="M18 8 L19.5 14 L26 14 L21 18 L23 25 L18 21 L13 25 L15 18 L10 14 L16.5 14 Z"
                />
              </svg>
            </div>

            {/* Highlight overlay */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
              }}
            />

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {wish.senderAvatar ? (
                <img
                  src={wish.senderAvatar}
                  alt="Sender"
                  className="w-1/2 h-1/2 rounded-full object-cover border-2"
                  style={{ borderColor: gradient.from }}
                />
              ) : (
                <span className="text-2xl">&#x2728;</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rating stars if rated */}
      {wish.rating !== null && wish.rating !== undefined && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < wish.rating! ? 'text-[var(--color-honey)]' : 'text-[var(--color-sand)]'}`}
            >
              &#x2605;
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function CoinTossAnimation({
  wish,
  coinTheme,
  onComplete
}: {
  wish: CoinProps['wish']
  coinTheme?: string | null
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
        <Coin wish={wish} size="lg" coinTheme={coinTheme} />
      </motion.div>

      {/* Splash effect at the end */}
      <motion.div
        className="absolute bottom-1/3"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        <div className="text-6xl">&#x1F4A6;</div>
      </motion.div>
    </motion.div>
  )
}

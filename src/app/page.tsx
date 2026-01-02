'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Nav } from '@/components/Nav'

// Example wishes to display on floating coins
const EXAMPLE_WISHES = [
  { text: 'You are brave and capable', emojis: ['💪', '✨'], rating: 5 },
  { text: 'Keep going — you\'ve got this', emojis: ['🔥'], rating: 4 },
  { text: 'Remember: you matter — always', emojis: ['❤️'], rating: 5 },
  { text: 'Sending you strength and courage', emojis: ['🌟'], rating: 5 },
  { text: 'You are not alone in this', emojis: ['💕'], rating: 4 },
  { text: 'Never stop believing in yourself', emojis: ['⭐', '💪'], rating: 5 },
  { text: 'Wishing you peace and clarity', emojis: ['🌈'], rating: 4 },
  { text: 'You inspire me — seriously', emojis: ['✨'], rating: 5 },
  { text: 'Keep shining — we see it', emojis: ['☀️'], rating: 4 },
]

// Positions around the well for floating coins
const COIN_POSITIONS = [
  { x: -140, y: -80 },   // top left
  { x: 140, y: -60 },    // top right
  { x: -160, y: 60 },    // mid left
  { x: 160, y: 80 },     // mid right
  { x: -120, y: 180 },   // bottom left
  { x: 130, y: 160 },    // bottom right
  { x: 0, y: -120 },     // top center
  { x: -180, y: 0 },     // far left
  { x: 180, y: 20 },     // far right
]

// SVG Coin for floating wishes
function FloatingCoin({
  wish,
  position,
  delay
}: {
  wish: typeof EXAMPLE_WISHES[0]
  position: { x: number; y: number }
  delay: number
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        x: position.x,
        y: position.y,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.8],
        y: [position.y, position.y - 10, position.y - 10, position.y - 20],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        repeatDelay: 12, // Wait for other coins to show
        ease: 'easeInOut',
      }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {/* Coin SVG */}
        <svg
          viewBox="0 0 36 36"
          className="w-24 h-24 md:w-28 md:h-28 drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle fill="#D97706" cx="18" cy="19" r="17" />
          <circle fill="#FBBF24" cx="18" cy="17" r="17" />
          <circle fill="#FCD34D" cx="18" cy="17" r="14" />
          <circle fill="none" stroke="#D97706" strokeWidth="0.5" cx="18" cy="17" r="13" />
          <circle fill="none" stroke="#FDE68A" strokeWidth="0.8" cx="18" cy="17" r="15.5" opacity="0.5" />
        </svg>

        {/* Wish text overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className="text-center">
            <p className="text-[9px] md:text-[10px] text-amber-900 font-medium leading-tight">
              {wish.text}
            </p>
            <p className="text-xs mt-0.5">{wish.emojis.join(' ')}</p>
          </div>
        </div>

        {/* Star rating */}
        {wish.rating && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < wish.rating ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Well SVG for the landing page
function HeroWellSVG({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Grass/ground base */}
      <path fill="#BCC987" d="M84.081,167.302c-4.662,0-8.44,3.779-8.44,8.44v42.481H64.974c-4.662,0-8.44,3.779-8.44,8.44s3.778,8.44,8.44,8.44h19.107c4.662,0,8.44-3.779,8.44-8.44v-42.481h297.187v-16.879H84.081z"/>

      {/* Roof poles - yellow */}
      <polygon fill="#FEC45E" points="405.357,100.318 405.357,145.329 391.905,167.835 378.452,145.329 378.452,100.318"/>
      <polygon fill="#FEC45E" points="161.094,100.318 161.094,145.329 147.647,167.835 134.2,145.329 134.2,100.318"/>

      {/* Support beams */}
      <rect x="378.452" y="145.329" fill="#FCDB5A" width="26.905" height="162.107"/>
      <rect x="134.2" y="145.329" fill="#FCDB5A" width="26.894" height="162.107"/>

      {/* Rope/handle */}
      <path fill="#4D3D36" d="M320.41,327.124c-4.662,0-8.44-3.779-8.44-8.44V164.29c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44v154.394C328.85,323.345,325.072,327.124,320.41,327.124z"/>

      {/* Roof - orange/red */}
      <polygon fill="#D35B38" points="429.157,0 455.466,111.571 421.707,111.571 364.466,55.785 395.398,0"/>
      <polygon fill="#E86F22" points="395.398,0 421.707,111.571 84.08,111.571 110.389,0"/>

      {/* Roof decorations */}
      <path fill="#D35B38" d="M276.852,61.411c-13.96,0-25.319-11.357-25.319-25.319c0-4.661,3.778-8.44,8.44-8.44c4.662,0,8.44,3.779,8.44,8.44c0,4.654,3.785,8.44,8.44,8.44c4.654,0,8.44-3.785,8.44-8.44c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44C302.171,50.052,290.812,61.411,276.852,61.411z"/>
      <path fill="#D35B38" d="M355.621,83.916c-13.96,0-25.319-11.357-25.319-25.319c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44c0,4.654,3.785,8.44,8.44,8.44s8.44-3.785,8.44-8.44c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44C380.94,72.558,369.581,83.916,355.621,83.916z"/>

      {/* Well base - stone */}
      <polygon fill="#FEC45E" points="131.949,340.362 131.949,385.373 373.849,512 407.608,512 407.608,340.362"/>
      <rect x="131.949" y="385.373" fill="#FCDB5A" width="241.9" height="126.627"/>

      {/* Well rim */}
      <polygon fill="#9CAC74" points="419.266,296.184 419.266,351.615 385.507,351.615 363.002,323.899 385.507,296.184"/>
      <rect x="120.28" y="296.184" fill="#BCC987" width="265.227" height="55.431"/>

      {/* Handle details */}
      <path fill="#4D3D36" d="M269.773,195.634c-4.662,0-8.44-3.779-8.44-8.44V164.29c0-4.661,3.778-8.44,8.44-8.44c4.662,0,8.44,3.779,8.44,8.44v22.904C278.212,191.855,274.435,195.634,269.773,195.634z"/>
      <path fill="#4D3D36" d="M295.091,195.634c-4.662,0-8.44-3.779-8.44-8.44V164.29c0-4.661,3.778-8.44,8.44-8.44c4.662,0,8.44,3.779,8.44,8.44v22.904C303.531,191.855,299.754,195.634,295.091,195.634z"/>
      <path fill="#4D3D36" d="M244.454,195.634c-4.662,0-8.44-3.779-8.44-8.44V164.29c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44v22.904C252.894,191.855,249.116,195.634,244.454,195.634z"/>
      <path fill="#4D3D36" d="M219.135,195.634c-4.662,0-8.44-3.779-8.44-8.44V164.29c0-4.661,3.778-8.44,8.44-8.44s8.44,3.779,8.44,8.44v22.904C227.575,191.855,223.797,195.634,219.135,195.634z"/>

      {/* Coins in well */}
      <circle fill="#FEC45E" cx="200" cy="465" r="12"/>
      <circle fill="#FEC45E" cx="327" cy="445" r="12"/>
      <circle fill="#FEC45E" cx="178" cy="440" r="12"/>
      <circle fill="#FBBF24" cx="250" cy="470" r="10"/>
      <circle fill="#FBBF24" cx="300" cy="475" r="10"/>
      <circle fill="#FCD34D" cx="225" cy="455" r="8"/>
    </svg>
  )
}

export default function HomePage() {
  const [visibleCoins, setVisibleCoins] = useState<number[]>([0, 1, 2])

  // Rotate which 3 coins are visible every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCoins(prev => {
        const next = prev.map(i => (i + 3) % 9)
        return next
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="h-screen flex flex-col bg-gradient-to-b from-amber-50 via-white to-rose-50 overflow-hidden">
      <Nav />

      {/* Single Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-4">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 mb-3">
            Toss a coin. Spread kindness.
          </h1>
          <p className="text-lg text-stone-600 max-w-md mx-auto">
            Send heartfelt wishes to people who need them most
          </p>
        </motion.div>

        {/* Well with floating coins */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-lg mx-auto mb-6"
        >
          {/* The well SVG */}
          <div className="relative mx-auto w-56 h-56 md:w-72 md:h-72">
            <HeroWellSVG className="w-full h-full drop-shadow-xl" />

            {/* Sparkle effects on well */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-xl pointer-events-none"
                style={{
                  left: `${35 + i * 10}%`,
                  top: `${70 + (i % 2) * 8}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.3, 0.8],
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

          {/* Floating coins around the well */}
          <AnimatePresence mode="sync">
            {visibleCoins.map((coinIndex, i) => (
              <FloatingCoin
                key={`${coinIndex}-${Math.floor(Date.now() / 6000)}`}
                wish={EXAMPLE_WISHES[coinIndex]}
                position={COIN_POSITIONS[coinIndex]}
                delay={i * 0.3}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/create">
            <Button size="lg" icon="✨">
              Open a Wishing Well
            </Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" variant="secondary" icon="🪙">
              Send a Wish
            </Button>
          </Link>
        </motion.div>

        {/* Subtle hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-stone-400 mt-4 text-center"
        >
          No account needed to send wishes
        </motion.p>
      </section>

      {/* Minimal Footer */}
      <footer className="py-4 px-4 border-t border-stone-100 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <div className="flex items-center gap-2">
            <span>🌟</span>
            <span className="font-medium text-stone-700">Wishing Well</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="hover:text-stone-700 transition">Explore</Link>
            <Link href="/leaderboard" className="hover:text-stone-700 transition">Leaderboard</Link>
          </div>
          <p className="text-stone-400">Spreading kindness, one coin at a time.</p>
        </div>
      </footer>
    </main>
  )
}

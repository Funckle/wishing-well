'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Nav } from '@/components/Nav'

// Example wishes to display on floating coins
const EXAMPLE_WISHES = [
  { text: 'You are brave and capable', emojis: ['&#x2728;'], rating: 5 },
  { text: 'Keep going, you\'ve got this', emojis: ['&#x1F525;'], rating: 4 },
  { text: 'Remember: you matter', emojis: ['&#x2764;'], rating: 5 },
  { text: 'Sending you strength', emojis: ['&#x1F31F;'], rating: 5 },
  { text: 'You are not alone', emojis: ['&#x1F495;'], rating: 4 },
  { text: 'Never stop believing', emojis: ['&#x2B50;'], rating: 5 },
]

// Floating coin positions
const COIN_POSITIONS = [
  { x: -220, y: -80, rotate: -8 },
  { x: 240, y: -40, rotate: 12 },
  { x: -280, y: 100, rotate: -5 },
  { x: 260, y: 140, rotate: 8 },
  { x: -180, y: 260, rotate: -10 },
  { x: 200, y: 240, rotate: 6 },
]

// Decorative floating coin
function FloatingCoin({
  wish,
  position,
  delay
}: {
  wish: typeof EXAMPLE_WISHES[0]
  position: { x: number; y: number; rotate: number }
  delay: number
}) {
  return (
    <motion.div
      className="absolute pointer-events-none hidden md:block"
      style={{
        left: '50%',
        top: '50%',
      }}
      initial={{ opacity: 0, scale: 0.8, x: position.x, y: position.y }}
      animate={{
        opacity: [0, 0.9, 0.9, 0],
        scale: [0.8, 1, 1, 0.9],
        x: position.x,
        y: [position.y, position.y - 15, position.y - 15, position.y - 30],
        rotate: [position.rotate, position.rotate + 2, position.rotate - 2, position.rotate],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        repeatDelay: 10,
        ease: 'easeInOut',
      }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {/* Coin shape with organic styling */}
        <div className="relative w-28 h-28 lg:w-32 lg:h-32">
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-[var(--color-honey)]/20 blur-xl" />

          {/* Coin body */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-honey)] via-[var(--color-amber)] to-[var(--color-gold)] shadow-lg" />

          {/* Inner ring */}
          <div className="absolute inset-2 rounded-full border-2 border-[var(--color-gold)]/40" />

          {/* Highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent" />

          {/* Text content */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="text-[10px] lg:text-xs text-center font-medium text-amber-900 leading-tight">
              {wish.text}
            </p>
          </div>
        </div>

        {/* Star rating below */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xs ${i < wish.rating ? 'text-[var(--color-honey)]' : 'text-[var(--color-sand)]'}`}
            >
              &#x2605;
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Decorative elements
function DecorativeElements() {
  return (
    <>
      {/* Top left botanical */}
      <motion.div
        className="absolute top-20 left-8 text-4xl opacity-20 hidden lg:block"
        animate={{ rotate: [0, 5, 0], y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        &#x1F33F;
      </motion.div>

      {/* Top right botanical */}
      <motion.div
        className="absolute top-32 right-12 text-3xl opacity-20 hidden lg:block"
        animate={{ rotate: [0, -5, 0], y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        &#x1F343;
      </motion.div>

      {/* Decorative dots pattern */}
      <div className="absolute top-40 left-1/4 w-24 h-24 decorative-dots opacity-30 hidden lg:block" />
      <div className="absolute bottom-40 right-1/4 w-32 h-32 decorative-dots opacity-20 hidden lg:block" />
    </>
  )
}

// Well illustration with warm organic styling - uses fixed light theme colors
function HeroWell({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Ambient glow behind well */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#E9B44C]/20 to-[#E07A5F]/10 blur-3xl" />
      </div>

      {/* Well SVG - hardcoded light theme colors for consistency */}
      <svg
        viewBox="0 0 496 576"
        className="w-full h-full drop-shadow-2xl relative z-10"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
      >
        {/* Roof - terracotta tones */}
        <g id="Roof">
          <path d="M136,108C188.411,103.181 248.907,90.693 317,71L348,22C301.535,46.651 242.886,68.219 157,82L136,108Z" fill="#C4785C" />
          <path d="M332,108L304,152L329,101L342,99C373.766,160.074 413.126,213.322 459,258C420.614,259.145 380.168,259.02 338,256C341.431,218.662 347.327,181.33 354,144L332,108Z" fill="#A65D42" />
          <path d="M317,71L342,99L374,59L348,22L317,71Z" fill="#F2A391" />
          <path d="M352.005,86.493C389.249,157.61 428.108,206.375 469,227L459,258C413.466,215.029 373.404,162.606 342,99L352.005,86.493Z" fill="#F2A391" />
          <path d="M136,108L157,124C158.105,122.306 158.891,120.39 159,118C263.583,97.176 311.809,91.157 315,91L329,101L342,99L317,71C254.969,86.647 194.205,99.82 136,108Z" fill="#A65D42" />
          <path d="M329,101C296.092,172.486 265.832,224.661 240,259C234.073,253.339 229.862,244.443 227,233C262.878,188.33 292.744,141.213 315,91L329,101Z" fill="#F2A391" />
          <path d="M159,118C155.625,147.897 32,242 32,242C32,242 139.904,243.68 227,233C266.735,184.955 295.053,137.794 315,91C275.529,93.774 224.44,102.321 159,118Z" fill="#C4785C" />
          <path d="M54,294C114.758,282.828 177.478,271.659 240,259L227,233C160.637,238.334 95.428,242.41 32,242C32.914,262.298 39.982,279.754 54,294Z" fill="#A65D42" />
          <path d="M332,108C331.662,107.944 309.165,234.978 309,425L330,430C329.863,333.019 337.152,235.986 354,144L332,108Z" fill="#F2A391" />
          <path d="M304,152C303.515,241.455 301.872,332.097 299,424L309,425C309.326,317.621 316.026,211.018 332,108L304,152Z" fill="#E07A5F" />
          <path d="M255,237L304,152C304.198,186.249 304.041,220.554 303,255L266,254L255,237Z" fill="#A65D42" />
          <path d="M176,271L179,425L161,427L151,276L176,271Z" fill="#F2A391" />
          <path d="M143,278C149.355,327.111 153.032,377.854 155,428L161,427L151,276L143,277" fill="#E07A5F" />
        </g>

        {/* Handle - moss greens */}
        <g id="Handle">
          <path d="M170,345L302,325L301,342L174,352L170,345Z" fill="#7A8B6E" />
          <path d="M324,322C357.205,316.429 379.588,314.058 384,317C386.116,340.301 381.118,358.058 383,368C383.102,370.617 385.309,371.811 389,372C389.052,373.513 389.784,374.881 387,377C385.248,377.566 383.733,378.363 380,377C376.709,367.073 377.313,355.037 378,338C376.847,335.071 352.258,336.749 327,339C319.219,335.902 318.755,330.033 324,322Z" fill="#A3B899" />
          <path d="M208,336C216.789,333.572 226.654,332.077 237,331C239.162,337.999 239.892,344.999 237,352C226.213,352.927 214.964,354.51 208,353C206.328,346.975 206.445,341.333 208,336Z" fill="#5C6B52" />
          <path d="M245,331L249,330C249.693,359.288 247.755,390.237 247,421L244,421C243.406,391.445 244.292,361.18 245,331Z" fill="#5C6B52" />
          <path d="M394,367C425.282,362.934 444.805,361.288 448,363C440.555,374.374 440.44,383.202 447,390C430.151,391.584 410.071,389.059 388,384C385.974,377.19 387.373,371.352 394,367Z" fill="#E07A5F" />
          <path d="M447,390C456.867,380.269 456.394,371.331 448,363C445.231,364.779 442.928,371.534 442,377C441.173,381.869 443.799,386.763 447,390Z" fill="#F2A391" />
        </g>

        {/* Well body - sandy stone */}
        <g id="Well">
          <path d="M111,435C189.971,420.934 267.018,411.534 330,430C353.694,478.523 375.896,498.977 396,480C398.757,504.891 402.025,530.391 397,546L194,543C185.755,515.222 187.042,480.636 194,442C199.227,428.675 158.681,430.645 111,435Z" fill="#E8D5C4" />
          <path d="M330,430L391,444L396,480C388.744,486.119 385.247,487.222 379,487C362.085,486.4 345.866,462.092 330,430Z" fill="#FDF8F3" />
          <path d="M252,433C238.45,431.145 226.824,431.48 218,435C212.206,439.246 209.62,444.5 211,451C215.774,458.178 225.674,459.232 240,455C256.865,452.097 259.364,444.226 252,433Z" fill="#D4A574" />
          <path d="M265,456C271.42,450.875 279.951,449 291,451C292.992,453.766 292.41,456.436 289,459C277.985,461.029 269.814,460.2 265,456Z" fill="#D4A574" />
          <path d="M334,504C374.149,491.183 410.377,484.573 427,509C429.481,524.279 431.956,539.556 428,553C403.988,555.63 369.226,552.396 336,550C332.824,534.357 332.2,519.029 334,504Z" fill="#9C9590" />
          <path d="M220,484C304.062,460.324 316.766,460.678 328,502L329,551L216,548C213.001,526.925 215.536,505.52 220,484Z" fill="#6B6560" />
          <path d="M111,435C146.858,431.846 179.715,428.907 195,435C191.326,471.576 189.875,509.219 193,546L93,540C96.297,505.349 101.699,470.426 111,435Z" fill="#6B6560" />
          <path d="M88,495C117.288,492.462 135.921,495.758 151,501C153.103,503.177 154.838,511.317 155,545L69,543C74.94,520.684 81.185,503.266 88,495Z" fill="#9C9590" />
          <path d="M168,514C168,514 198.274,509.147 205,512C207.902,515.398 207.416,530.142 206,548L165,547C167.456,536.698 168,514 168,514Z" fill="#FDF8F3" />
          <path d="M160,517C158.806,527.636 159.658,536.974 161,546L165,547C167.952,537.05 168.142,525.957 168,514L160,517Z" fill="#D4A574" />
        </g>
      </svg>

      {/* Sparkle effects */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg pointer-events-none"
          style={{
            left: `${30 + i * 10}%`,
            top: `${60 + (i % 2) * 12}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          &#x2728;
        </motion.div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [visibleCoins, setVisibleCoins] = useState<number[]>([0, 1, 2])

  // Rotate visible coins
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCoins(prev => prev.map(i => (i + 3) % 6))
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen flex flex-col overflow-hidden bg-[var(--bg-primary)]">
      <Nav />

      {/* Decorative background elements */}
      <DecorativeElements />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8 relative">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-8 max-w-2xl mx-auto relative z-10"
        >
          {/* Decorative label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-sand)] border border-[var(--border-subtle)] mb-6"
          >
            <span>&#x1FAAB;</span>
            <span className="text-sm font-medium text-[var(--text-secondary)]">A place for kind words</span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--text-primary)] mb-4 leading-tight">
            Toss a coin.{' '}
            <span className="text-gradient-warm">Spread kindness.</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
            Send heartfelt wishes to people who need them most, or open a well to receive encouragement from others.
          </p>
        </motion.div>

        {/* Well with floating coins */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full max-w-lg mx-auto mb-8"
        >
          <div className="relative mx-auto w-72 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem]">
            <HeroWell className="w-full h-full" />

            {/* Floating coins */}
            <AnimatePresence mode="sync">
              {visibleCoins.map((coinIndex, i) => (
                <FloatingCoin
                  key={`${coinIndex}-${Math.floor(Date.now() / 8000)}`}
                  wish={EXAMPLE_WISHES[coinIndex]}
                  position={COIN_POSITIONS[coinIndex]}
                  delay={i * 0.4}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
        >
          <Link href="/create">
            <Button size="lg" icon="&#x2728;">
              Open a Wishing Well
            </Button>
          </Link>
          <Link href="/explore">
            <Button size="lg" variant="secondary" icon="&#x1FAAB;">
              Send a Wish
            </Button>
          </Link>
        </motion.div>

        {/* Subtle note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-sm text-[var(--text-faded)] mt-6 text-center"
        >
          No account needed to send wishes
        </motion.p>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>&#x1FAAB;</span>
            <span className="font-display font-medium text-[var(--text-primary)]">Wishing Well</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/explore" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              Explore
            </Link>
            <Link href="/leaderboard" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              Leaderboard
            </Link>
            <Link href="/how-it-works" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              How It Works
            </Link>
          </div>
          <p className="text-[var(--text-faded)]">Spreading kindness, one coin at a time.</p>
        </div>
      </footer>
    </main>
  )
}

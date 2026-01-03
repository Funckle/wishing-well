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
    senderAvatar?: string | null
    rating?: number | null
    isViewed: boolean
    coinTheme?: string | null
  }>
  onFishCoin?: () => void
  showFishButton?: boolean
  /** When true, only shows the well SVG without context, progress, or badges */
  previewMode?: boolean
}

// Well SVG component with theme support
function WellSVG({
  className = '',
  theme,
}: {
  className?: string
  theme: WellTheme
}) {
  const c = theme.colors

  return (
    <svg
      viewBox="0 0 496 576"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
    >
      {/* Roof */}
      <g id="Roof">
        <path d="M136,108C188.411,103.181 248.907,90.693 317,71L348,22C301.535,46.651 242.886,68.219 157,82L136,108Z" fill={c.roof} />
        <path d="M332,108L304,152L329,101L342,99C373.766,160.074 413.126,213.322 459,258C420.614,259.145 380.168,259.02 338,256C341.431,218.662 347.327,181.33 354,144L332,108Z" fill={c.roofDark} />
        <path d="M317,71L342,99L374,59L348,22L317,71Z" fill={c.roofLight} />
        <path d="M352.005,86.493C389.249,157.61 428.108,206.375 469,227L459,258C413.466,215.029 373.404,162.606 342,99L352.005,86.493Z" fill={c.roofLight} />
        <path d="M136,108L157,124C158.105,122.306 158.891,120.39 159,118C263.583,97.176 311.809,91.157 315,91L329,101L342,99L317,71C254.969,86.647 194.205,99.82 136,108Z" fill={c.roofDark} />
        <path d="M329,101C296.092,172.486 265.832,224.661 240,259C234.073,253.339 229.862,244.443 227,233C262.878,188.33 292.744,141.213 315,91L329,101Z" fill={c.roofLight} />
        <path d="M159,118C155.625,147.897 32,242 32,242C32,242 139.904,243.68 227,233C266.735,184.955 295.053,137.794 315,91C275.529,93.774 224.44,102.321 159,118Z" fill={c.roof} />
        <path d="M54,294C114.758,282.828 177.478,271.659 240,259L227,233C160.637,238.334 95.428,242.41 32,242C32.914,262.298 39.982,279.754 54,294Z" fill={c.roofDark} />
        <path d="M332,108C331.662,107.944 309.165,234.978 309,425L330,430C329.863,333.019 337.152,235.986 354,144L332,108Z" fill={c.roofLight} />
        <path d="M304,152C303.515,241.455 301.872,332.097 299,424L309,425C309.326,317.621 316.026,211.018 332,108L304,152Z" fill={c.roofMid} />
        <path d="M255,237L304,152C304.198,186.249 304.041,220.554 303,255L266,254L255,237Z" fill={c.roofDark} />
        <path d="M176,271L179,425L161,427L151,276L176,271Z" fill={c.roofLight} />
        <path d="M143,278C149.355,327.111 153.032,377.854 155,428L161,427L151,276L143,277" fill={c.roofMid} />
      </g>

      {/* Handle */}
      <g id="Handle">
        <path d="M170,345L302,325L301,342L174,352L170,345Z" fill={c.ropeMid} />
        <path d="M324,322C357.205,316.429 379.588,314.058 384,317C386.116,340.301 381.118,358.058 383,368C383.102,370.617 385.309,371.811 389,372C389.052,373.513 389.784,374.881 387,377C385.248,377.566 383.733,378.363 380,377C376.709,367.073 377.313,355.037 378,338C376.847,335.071 352.258,336.749 327,339C319.219,335.902 318.755,330.033 324,322Z" fill={c.ropeLight} />
        <path d="M208,336C216.789,333.572 226.654,332.077 237,331C239.162,337.999 239.892,344.999 237,352C226.213,352.927 214.964,354.51 208,353C206.328,346.975 206.445,341.333 208,336Z" fill={c.rope} />
        <path d="M245,331L249,330C249.693,359.288 247.755,390.237 247,421L244,421C243.406,391.445 244.292,361.18 245,331Z" fill={c.rope} />
        <path d="M394,367C425.282,362.934 444.805,361.288 448,363C440.555,374.374 440.44,383.202 447,390C430.151,391.584 410.071,389.059 388,384C385.974,377.19 387.373,371.352 394,367Z" fill={c.roofMid} />
        <path d="M447,390C456.867,380.269 456.394,371.331 448,363C445.231,364.779 442.928,371.534 442,377C441.173,381.869 443.799,386.763 447,390Z" fill={c.roofLight} />
      </g>

      {/* Well */}
      <g id="Well">
        <path d="M111,435C189.971,420.934 267.018,411.534 330,430C353.694,478.523 375.896,498.977 396,480C398.757,504.891 402.025,530.391 397,546L194,543C185.755,515.222 187.042,480.636 194,442C199.227,428.675 158.681,430.645 111,435Z" fill={c.stone} />
        <path d="M330,430L391,444L396,480C388.744,486.119 385.247,487.222 379,487C362.085,486.4 345.866,462.092 330,430Z" fill={c.stoneLight} />
        <path d="M252,433C238.45,431.145 226.824,431.48 218,435C212.206,439.246 209.62,444.5 211,451C215.774,458.178 225.674,459.232 240,455C256.865,452.097 259.364,444.226 252,433Z" fill={c.stoneAccent} />
        <path d="M265,456C271.42,450.875 279.951,449 291,451C292.992,453.766 292.41,456.436 289,459C277.985,461.029 269.814,460.2 265,456Z" fill={c.stoneAccent} />
        <path d="M334,504C374.149,491.183 410.377,484.573 427,509C429.481,524.279 431.956,539.556 428,553C403.988,555.63 369.226,552.396 336,550C332.824,534.357 332.2,519.029 334,504Z" fill={c.stoneDark} />
        <path d="M220,484C304.062,460.324 316.766,460.678 328,502L329,551L216,548C213.001,526.925 215.536,505.52 220,484Z" fill={c.stoneMid} />
        <path d="M111,435C146.858,431.846 179.715,428.907 195,435C191.326,471.576 189.875,509.219 193,546L93,540C96.297,505.349 101.699,470.426 111,435Z" fill={c.stoneMid} />
        <path d="M88,495C117.288,492.462 135.921,495.758 151,501C153.103,503.177 154.838,511.317 155,545L69,543C74.94,520.684 81.185,503.266 88,495Z" fill={c.stoneDark} />
        <path d="M168,514C168,514 198.274,509.147 205,512C207.902,515.398 207.416,530.142 206,548L165,547C167.456,536.698 168,514 168,514Z" fill={c.stoneLight} />
        <path d="M160,517C158.806,527.636 159.658,536.974 161,546L165,547C167.952,537.05 168.142,525.957 168,514L160,517Z" fill={c.stoneAccent} />
      </g>
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
  previewMode = false,
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

  // Preview mode: just the well SVG, sized to fit container
  if (previewMode) {
    return (
      <div className="relative w-full h-full flex items-end justify-center overflow-hidden">
        <WellSVG
          className="h-[105%] w-auto drop-shadow-xl"
          theme={theme}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col">
      {/* Progress indicator + Status badges - TOP */}
      <div className="mb-6">
        <div className="w-full max-w-xs mx-auto">
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
          <div className="w-full h-3 bg-stone-200/80 rounded-full overflow-hidden backdrop-blur">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Status badges */}
        <div className="mt-3 flex justify-center gap-2">
          {isActive ? (
            <span className="px-3 py-1 bg-green-100/90 backdrop-blur text-green-700 rounded-full text-sm font-medium">
              Active
            </span>
          ) : (
            <span className="px-3 py-1 bg-stone-100/90 backdrop-blur text-stone-600 rounded-full text-sm font-medium">
              Closed
            </span>
          )}
          {averageRating && (
            <span className="px-3 py-1 bg-amber-100/90 backdrop-blur text-amber-700 rounded-full text-sm font-medium flex items-center gap-1">
              <span>★</span>
              {averageRating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Fish button - above well */}
        {showFishButton && unviewedCount > 0 && (
          <motion.button
            className="mt-4 mx-auto block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium shadow-lg disabled:opacity-50"
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
      </div>

      {/* Well structure - BOTTOM */}
      <div className="relative">
        {/* SVG Well illustration */}
        <div className="relative mx-auto w-full max-w-[36rem]">
          <WellSVG
            className="w-full h-full drop-shadow-xl"
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
      </div>
    </div>
  )
}

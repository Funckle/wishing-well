'use client'

import Image from 'next/image'
import type { BackgroundTheme } from '@/lib/themes'

// Import all background images
import desertImg from '@/lib/images/desert.webp'
import forestImg from '@/lib/images/forest.webp'
import forestPathImg from '@/lib/images/forest_path.webp'
import jungleImg from '@/lib/images/jungle.webp'
import mountainsImg from '@/lib/images/mountains.webp'
import parkImg from '@/lib/images/park.webp'
import planetImg from '@/lib/images/planet.webp'
import savannahImg from '@/lib/images/savannah.webp'
import sunsetImg from '@/lib/images/sunset.webp'

interface BackgroundSceneProps {
  theme: BackgroundTheme
  children: React.ReactNode
}

// Map image keys to imported images
const BACKGROUND_IMAGES = {
  desert: desertImg,
  forest: forestImg,
  forest_path: forestPathImg,
  jungle: jungleImg,
  mountains: mountainsImg,
  park: parkImg,
  planet: planetImg,
  savannah: savannahImg,
  sunset: sunsetImg,
} as const

export function BackgroundScene({ theme, children }: BackgroundSceneProps) {
  const backgroundImage = theme.image ? BACKGROUND_IMAGES[theme.image] : null

  const gradientStyle = {
    background: theme.gradient.via
      ? `linear-gradient(to bottom, ${theme.gradient.from}, ${theme.gradient.via}, ${theme.gradient.to})`
      : `linear-gradient(to bottom, ${theme.gradient.from}, ${theme.gradient.to})`,
  }

  return (
    <div className="relative min-h-screen" style={gradientStyle}>
      {/* Background image - fixed to bottom, centered, natural size, overflow top */}
      {backgroundImage && (
        <div className="fixed bottom-0 left-0 right-0 overflow-hidden pointer-events-none flex justify-center">
          <Image
            src={backgroundImage}
            alt=""
            priority
            className="max-w-none opacity-70"
            style={{
              width: 'auto',
              height: 'auto',
              maxHeight: 'none',
            }}
          />
          {/* Gradient overlay to blend with top gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${theme.gradient.from} 0%, transparent 30%)`,
            }}
          />
        </div>
      )}
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

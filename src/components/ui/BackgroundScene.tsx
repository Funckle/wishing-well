'use client'

import type { BackgroundTheme } from '@/lib/themes'

interface BackgroundSceneProps {
  theme: BackgroundTheme
  children: React.ReactNode
  /** When true, renders in a contained preview mode instead of full-screen */
  preview?: boolean
}

export function BackgroundScene({ theme, children, preview = false }: BackgroundSceneProps) {
  const gradientStyle = {
    background: theme.gradient.via
      ? `linear-gradient(to bottom, ${theme.gradient.from}, ${theme.gradient.via}, ${theme.gradient.to})`
      : `linear-gradient(to bottom, ${theme.gradient.from}, ${theme.gradient.to})`,
  }

  // Preview mode: contained, no fixed positioning
  if (preview) {
    return (
      <div className="relative h-full w-full overflow-hidden" style={gradientStyle}>
        <div className="relative z-10 h-full">{children}</div>
      </div>
    )
  }

  // Full-screen mode
  return (
    <div className="relative min-h-screen" style={gradientStyle}>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

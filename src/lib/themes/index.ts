// Theme system for visual customization
// Provides types and helper functions for well, background, and coin themes

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface WellTheme {
  id: string
  label: string
  emoji: string
  colors: {
    // Roof colors (warm tones)
    roof: string        // Main roof color
    roofDark: string    // Roof shadow/dark areas
    roofLight: string   // Roof highlights
    roofMid: string     // Roof mid-tone
    // Handle/Rope colors (cool tones)
    rope: string        // Dark rope/handle
    ropeMid: string     // Medium rope/handle
    ropeLight: string   // Light rope/handle
    // Stone/Well base colors (neutrals)
    stone: string       // Main stone color
    stoneDark: string   // Dark stone areas
    stoneMid: string    // Medium stone
    stoneLight: string  // Stone highlights
    stoneAccent: string // Stone accent details
  }
}

export interface BackgroundTheme {
  id: string
  label: string
  emoji: string
  gradient: {
    from: string
    via?: string
    to: string
  }
}

export interface CoinTheme {
  id: string
  label: string
  emoji: string
  colors: {
    shadow: string
    main: string
    highlight: string
    ring: string
    rimHighlight: string
    textColor: string
    // Back of coin
    backShadow: string
    backMain: string
    backHighlight: string
    backPattern: string
    backRing: string
    backRimHighlight: string
  }
}

// ============================================
// RE-EXPORTS
// ============================================

export { WELL_THEMES } from './wellThemes'
export { BACKGROUND_THEMES } from './backgroundThemes'
export { COIN_THEMES } from './coinThemes'

// ============================================
// HELPER FUNCTIONS
// ============================================

import { WELL_THEMES } from './wellThemes'
import { BACKGROUND_THEMES } from './backgroundThemes'
import { COIN_THEMES } from './coinThemes'

export function getWellThemeById(id: string | null | undefined): WellTheme {
  if (!id) return WELL_THEMES[0]
  return WELL_THEMES.find((t) => t.id === id) || WELL_THEMES[0]
}

export function getBackgroundThemeById(id: string | null | undefined): BackgroundTheme | null {
  if (!id) return null
  return BACKGROUND_THEMES.find((t) => t.id === id) || null
}

export function getCoinThemeById(id: string | null | undefined): CoinTheme {
  if (!id) return COIN_THEMES[0]
  return COIN_THEMES.find((t) => t.id === id) || COIN_THEMES[0]
}

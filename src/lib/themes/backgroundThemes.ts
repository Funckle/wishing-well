import type { BackgroundTheme } from './index'

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  {
    id: 'none',
    label: 'None',
    emoji: '⬜',
    gradient: {
      from: '#fef7f0',
      via: '#fdf2e9',
      to: '#fce7d6',
    },
    image: null,
  },
  {
    id: 'desert',
    label: 'Desert',
    emoji: '🏜️',
    gradient: {
      from: '#fbbf24',
      via: '#f59e0b',
      to: '#d97706',
    },
    image: 'desert',
  },
  {
    id: 'forest',
    label: 'Forest',
    emoji: '🌲',
    gradient: {
      from: '#166534',
      via: '#15803d',
      to: '#22c55e',
    },
    image: 'forest',
  },
  {
    id: 'forest_path',
    label: 'Forest Path',
    emoji: '🛤️',
    gradient: {
      from: '#14532d',
      via: '#166534',
      to: '#4ade80',
    },
    image: 'forest_path',
  },
  {
    id: 'jungle',
    label: 'Jungle',
    emoji: '🌴',
    gradient: {
      from: '#064e3b',
      via: '#047857',
      to: '#10b981',
    },
    image: 'jungle',
  },
  {
    id: 'mountains',
    label: 'Mountains',
    emoji: '🏔️',
    gradient: {
      from: '#7dd3fc',
      via: '#bae6fd',
      to: '#e0f2fe',
    },
    image: 'mountains',
  },
  {
    id: 'park',
    label: 'Park',
    emoji: '🌳',
    gradient: {
      from: '#86efac',
      via: '#4ade80',
      to: '#22c55e',
    },
    image: 'park',
  },
  {
    id: 'planet',
    label: 'Planet',
    emoji: '🪐',
    gradient: {
      from: '#0f172a',
      via: '#1e1b4b',
      to: '#312e81',
    },
    image: 'planet',
  },
  {
    id: 'savannah',
    label: 'Savannah',
    emoji: '🦁',
    gradient: {
      from: '#fcd34d',
      via: '#f59e0b',
      to: '#b45309',
    },
    image: 'savannah',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    emoji: '🌅',
    gradient: {
      from: '#1e293b',
      via: '#f97316',
      to: '#fbbf24',
    },
    image: 'sunset',
  },
]

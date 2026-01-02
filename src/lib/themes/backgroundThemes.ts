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
    landscape: 'none',
  },
  {
    id: 'city',
    label: 'City',
    emoji: '🏙️',
    gradient: {
      from: '#1e293b',
      via: '#475569',
      to: '#f97316',
    },
    landscape: 'city',
  },
  {
    id: 'beach',
    label: 'Beach',
    emoji: '🏖️',
    gradient: {
      from: '#0ea5e9',
      via: '#38bdf8',
      to: '#fde68a',
    },
    landscape: 'beach',
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
    landscape: 'mountains',
  },
  {
    id: 'forest',
    label: 'Forest',
    emoji: '🌳',
    gradient: {
      from: '#166534',
      via: '#22c55e',
      to: '#bbf7d0',
    },
    landscape: 'forest',
  },
  {
    id: 'nightsky',
    label: 'Night Sky',
    emoji: '🌌',
    gradient: {
      from: '#0f172a',
      via: '#1e1b4b',
      to: '#312e81',
    },
    landscape: 'nightsky',
  },
  {
    id: 'meadow',
    label: 'Meadow',
    emoji: '🌸',
    gradient: {
      from: '#fdf4ff',
      via: '#fae8ff',
      to: '#d9f99d',
    },
    landscape: 'meadow',
  },
]

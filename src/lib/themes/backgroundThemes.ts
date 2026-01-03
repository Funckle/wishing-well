import type { BackgroundTheme } from './index'

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  {
    id: 'none',
    label: 'None',
    emoji: '⬜',
    gradient: {
      from: '#FDF8F3',
      via: '#FAF6F1',
      to: '#F5EDE4',
    },
  },
  {
    id: 'sunrise',
    label: 'Sunrise',
    emoji: '🌅',
    gradient: {
      from: '#FDF8F3',
      via: '#FAE5D8',
      to: '#F8C4B0',
    },
  },
  {
    id: 'meadow',
    label: 'Meadow',
    emoji: '🌿',
    gradient: {
      from: '#F0F5ED',
      via: '#D4E4CD',
      to: '#A3B899',
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    emoji: '🌊',
    gradient: {
      from: '#F0F7FA',
      via: '#D4E8EF',
      to: '#9ECFDC',
    },
  },
  {
    id: 'dusk',
    label: 'Dusk',
    emoji: '🌆',
    gradient: {
      from: '#F5F0F8',
      via: '#E4D8EF',
      to: '#C4A8D4',
    },
  },
  {
    id: 'golden',
    label: 'Golden Hour',
    emoji: '✨',
    gradient: {
      from: '#FDF8F0',
      via: '#F5E6C8',
      to: '#E9B44C',
    },
  },
]

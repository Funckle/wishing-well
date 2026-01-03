import type { WellTheme } from './index'

export const WELL_THEMES: WellTheme[] = [
  {
    id: 'classic',
    label: 'Classic',
    emoji: '🏛️',
    colors: {
      // Roof - warm oranges and reds
      roof: '#D46B44',      // Main orange
      roofDark: '#812121',  // Dark red shadow
      roofLight: '#E7783D', // Light orange highlight
      roofMid: '#B44546',   // Mid red-orange
      // Handle - purples
      rope: '#513764',      // Dark purple
      ropeMid: '#706F9C',   // Medium purple
      ropeLight: '#A19AB2', // Light purple
      // Stone - gray-greens
      stone: '#B3C8BC',     // Main stone
      stoneDark: '#5B6984', // Dark stone
      stoneMid: '#61778D',  // Medium stone
      stoneLight: '#E5EED3', // Light highlight
      stoneAccent: '#92A4A9', // Accent detail
    },
  },
  {
    id: 'rose-garden',
    label: 'Rose Garden',
    emoji: '🌹',
    colors: {
      // Roof - pinks and magentas
      roof: '#F472B6',      // Main pink
      roofDark: '#9D174D',  // Dark magenta
      roofLight: '#FBCFE8', // Light pink
      roofMid: '#DB2777',   // Mid magenta
      // Handle - rose tones
      rope: '#831843',      // Dark rose
      ropeMid: '#BE185D',   // Medium rose
      ropeLight: '#F9A8D4', // Light rose
      // Stone - soft greens
      stone: '#D1FAE5',     // Main mint
      stoneDark: '#059669', // Dark green
      stoneMid: '#34D399',  // Medium green
      stoneLight: '#ECFDF5', // Light mint
      stoneAccent: '#6EE7B7', // Accent green
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    emoji: '🌊',
    colors: {
      // Roof - teals and cyans
      roof: '#0EA5E9',      // Main sky blue
      roofDark: '#0369A1',  // Dark blue
      roofLight: '#7DD3FC', // Light blue
      roofMid: '#0284C7',   // Mid blue
      // Handle - deep ocean
      rope: '#164E63',      // Dark teal
      ropeMid: '#0891B2',   // Medium cyan
      ropeLight: '#67E8F9', // Light cyan
      // Stone - sandy beige
      stone: '#FEF3C7',     // Main sand
      stoneDark: '#92400E', // Dark brown
      stoneMid: '#D97706',  // Medium amber
      stoneLight: '#FFFBEB', // Light cream
      stoneAccent: '#FDE68A', // Accent gold
    },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    emoji: '🌅',
    colors: {
      // Roof - oranges and warm tones
      roof: '#F97316',      // Main orange
      roofDark: '#9A3412',  // Dark burnt orange
      roofLight: '#FDBA74', // Light peach
      roofMid: '#EA580C',   // Mid orange
      // Handle - purples (twilight)
      rope: '#581C87',      // Dark purple
      ropeMid: '#7C3AED',   // Medium violet
      ropeLight: '#C4B5FD', // Light lavender
      // Stone - warm grays
      stone: '#FDE68A',     // Main gold
      stoneDark: '#78350F', // Dark brown
      stoneMid: '#B45309',  // Medium amber
      stoneLight: '#FEF3C7', // Light cream
      stoneAccent: '#FBBF24', // Accent yellow
    },
  },
  {
    id: 'forest',
    label: 'Forest',
    emoji: '🌲',
    colors: {
      // Roof - deep greens
      roof: '#166534',      // Main forest green
      roofDark: '#14532D',  // Dark green
      roofLight: '#4ADE80', // Light green
      roofMid: '#15803D',   // Mid green
      // Handle - browns (wood)
      rope: '#422006',      // Dark brown
      ropeMid: '#78350F',   // Medium brown
      ropeLight: '#A16207', // Light brown
      // Stone - earthy tones
      stone: '#D6D3D1',     // Main stone gray
      stoneDark: '#57534E', // Dark stone
      stoneMid: '#78716C',  // Medium stone
      stoneLight: '#F5F5F4', // Light stone
      stoneAccent: '#A8A29E', // Accent gray
    },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    emoji: '🌙',
    colors: {
      // Roof - deep blues
      roof: '#1E40AF',      // Main royal blue
      roofDark: '#1E3A8A',  // Dark navy
      roofLight: '#60A5FA', // Light blue
      roofMid: '#1D4ED8',   // Mid blue
      // Handle - silver/gray
      rope: '#0F172A',      // Dark slate
      ropeMid: '#475569',   // Medium slate
      ropeLight: '#94A3B8', // Light slate
      // Stone - cool grays
      stone: '#475569',     // Main slate
      stoneDark: '#1E293B', // Dark slate
      stoneMid: '#334155',  // Medium slate
      stoneLight: '#CBD5E1', // Light slate
      stoneAccent: '#64748B', // Accent slate
    },
  },
]

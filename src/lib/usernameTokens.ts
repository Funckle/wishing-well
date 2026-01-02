// Username token system for generating safe, themed display names
// Format: [Theme] -> [Adjective] + [Noun]

export interface UsernameTheme {
  id: string
  label: string
  emoji: string
  adjectives: string[]
  nouns: string[]
}

export const USERNAME_THEMES: UsernameTheme[] = [
  {
    id: 'cosmic',
    label: 'Cosmic',
    emoji: '🌟',
    adjectives: [
      'Stellar', 'Cosmic', 'Astral', 'Celestial', 'Lunar', 'Solar', 'Starlit',
      'Nebula', 'Galactic', 'Orbital', 'Radiant', 'Glowing', 'Shimmering',
      'Twinkling', 'Infinite', 'Eternal', 'Mystical', 'Ethereal', 'Aurora',
      'Midnight', 'Twilight', 'Dawn', 'Dusk', 'Eclipse', 'Meteor', 'Supernova',
      'Quantum', 'Luminous', 'Brilliant', 'Sparkling'
    ],
    nouns: [
      'Star', 'Moon', 'Comet', 'Galaxy', 'Nebula', 'Voyager', 'Explorer',
      'Dreamer', 'Seeker', 'Wanderer', 'Traveler', 'Navigator', 'Stargazer',
      'Observer', 'Watcher', 'Guardian', 'Keeper', 'Beacon', 'Light', 'Spirit',
      'Soul', 'Heart', 'Mind', 'Essence', 'Pulse', 'Wave', 'Ray', 'Glow',
      'Spark', 'Flame'
    ]
  },
  {
    id: 'nature',
    label: 'Nature',
    emoji: '🌿',
    adjectives: [
      'Gentle', 'Wild', 'Serene', 'Tranquil', 'Peaceful', 'Calm', 'Flowing',
      'Growing', 'Blooming', 'Flourishing', 'Verdant', 'Lush', 'Fresh',
      'Crisp', 'Dewy', 'Misty', 'Breezy', 'Sunny', 'Rainy', 'Stormy',
      'Golden', 'Silver', 'Emerald', 'Amber', 'Crystal', 'Ancient', 'Timeless',
      'Rooted', 'Grounded', 'Earthen'
    ],
    nouns: [
      'River', 'Mountain', 'Forest', 'Meadow', 'Garden', 'Grove', 'Valley',
      'Stream', 'Lake', 'Ocean', 'Willow', 'Oak', 'Maple', 'Cedar', 'Pine',
      'Fern', 'Moss', 'Pebble', 'Stone', 'Boulder', 'Leaf', 'Petal', 'Bloom',
      'Blossom', 'Root', 'Branch', 'Seed', 'Sprout', 'Breeze', 'Rain'
    ]
  },
  {
    id: 'kindness',
    label: 'Kindness',
    emoji: '💝',
    adjectives: [
      'Kind', 'Caring', 'Loving', 'Gentle', 'Tender', 'Warm', 'Generous',
      'Giving', 'Helpful', 'Thoughtful', 'Considerate', 'Compassionate',
      'Empathetic', 'Understanding', 'Patient', 'Gracious', 'Humble', 'Noble',
      'Pure', 'True', 'Honest', 'Loyal', 'Faithful', 'Devoted', 'Sincere',
      'Heartfelt', 'Genuine', 'Authentic', 'Sweet', 'Precious'
    ],
    nouns: [
      'Heart', 'Soul', 'Spirit', 'Friend', 'Helper', 'Giver', 'Supporter',
      'Champion', 'Advocate', 'Ally', 'Companion', 'Guide', 'Mentor', 'Angel',
      'Blessing', 'Gift', 'Treasure', 'Jewel', 'Gem', 'Pearl', 'Light',
      'Warmth', 'Comfort', 'Joy', 'Hope', 'Peace', 'Love', 'Grace', 'Harmony',
      'Unity'
    ]
  },
  {
    id: 'adventure',
    label: 'Adventure',
    emoji: '⚔️',
    adjectives: [
      'Brave', 'Bold', 'Daring', 'Fearless', 'Courageous', 'Valiant', 'Heroic',
      'Mighty', 'Strong', 'Fierce', 'Swift', 'Quick', 'Agile', 'Nimble',
      'Clever', 'Wise', 'Cunning', 'Sharp', 'Keen', 'Alert', 'Ready',
      'Steadfast', 'Resolute', 'Determined', 'Relentless', 'Unstoppable',
      'Epic', 'Legendary', 'Noble', 'Proud'
    ],
    nouns: [
      'Knight', 'Warrior', 'Hero', 'Champion', 'Guardian', 'Defender',
      'Protector', 'Ranger', 'Scout', 'Pathfinder', 'Trailblazer', 'Pioneer',
      'Adventurer', 'Explorer', 'Voyager', 'Seeker', 'Hunter', 'Tracker',
      'Rider', 'Captain', 'Commander', 'Leader', 'Chief', 'Legend', 'Myth',
      'Saga', 'Quest', 'Journey', 'Triumph', 'Victory'
    ]
  },
  {
    id: 'mystic',
    label: 'Mystic',
    emoji: '🔮',
    adjectives: [
      'Mystic', 'Magic', 'Enchanted', 'Arcane', 'Ancient', 'Sacred', 'Divine',
      'Blessed', 'Charmed', 'Spellbound', 'Ethereal', 'Phantom', 'Shadow',
      'Hidden', 'Secret', 'Veiled', 'Mysterious', 'Enigmatic', 'Cryptic',
      'Elusive', 'Whispering', 'Silent', 'Echoing', 'Fading', 'Glimmering',
      'Shimmering', 'Iridescent', 'Prismatic', 'Spectral', 'Astral'
    ],
    nouns: [
      'Sage', 'Oracle', 'Seer', 'Prophet', 'Wizard', 'Mage', 'Sorcerer',
      'Enchanter', 'Alchemist', 'Mystic', 'Shaman', 'Druid', 'Healer',
      'Weaver', 'Dreamer', 'Visionary', 'Keeper', 'Warden', 'Sentinel',
      'Spirit', 'Phantom', 'Specter', 'Wraith', 'Echo', 'Whisper', 'Shadow',
      'Riddle', 'Enigma', 'Mystery', 'Wonder'
    ]
  },
  {
    id: 'whimsical',
    label: 'Whimsical',
    emoji: '🦋',
    adjectives: [
      'Whimsical', 'Playful', 'Cheerful', 'Joyful', 'Merry', 'Jolly', 'Happy',
      'Sunny', 'Bubbly', 'Sparkling', 'Dancing', 'Prancing', 'Skipping',
      'Bouncing', 'Floating', 'Drifting', 'Twirling', 'Spinning', 'Gliding',
      'Soaring', 'Flying', 'Dreamy', 'Fluffy', 'Cozy', 'Snug', 'Cuddly',
      'Fuzzy', 'Silly', 'Goofy', 'Quirky'
    ],
    nouns: [
      'Butterfly', 'Firefly', 'Ladybug', 'Bumblebee', 'Hummingbird', 'Robin',
      'Sparrow', 'Bluebird', 'Bunny', 'Kitten', 'Puppy', 'Duckling', 'Fawn',
      'Sprite', 'Pixie', 'Fairy', 'Elf', 'Gnome', 'Nymph', 'Wisp', 'Bubble',
      'Rainbow', 'Cupcake', 'Cookie', 'Marshmallow', 'Starlight', 'Moonbeam',
      'Sunray', 'Dewdrop', 'Snowflake'
    ]
  }
]

// Get a theme by ID
export function getThemeById(themeId: string): UsernameTheme | undefined {
  return USERNAME_THEMES.find((t) => t.id === themeId)
}

// Generate a random username for a theme
export function generateRandomUsername(themeId: string): string {
  const theme = getThemeById(themeId)
  if (!theme) return 'Anonymous Wisher'

  const adjective = theme.adjectives[Math.floor(Math.random() * theme.adjectives.length)]
  const noun = theme.nouns[Math.floor(Math.random() * theme.nouns.length)]

  return `${adjective} ${noun}`
}

// Calculate total possible combinations per theme
export function getThemeCombinations(themeId: string): number {
  const theme = getThemeById(themeId)
  if (!theme) return 0
  return theme.adjectives.length * theme.nouns.length
}

// Get total combinations across all themes
export function getTotalCombinations(): number {
  return USERNAME_THEMES.reduce((total, theme) => {
    return total + theme.adjectives.length * theme.nouns.length
  }, 0)
}

// Generate a completely random username from any theme
export function generateRandomUsernameAnyTheme(): { name: string; themeId: string } {
  const randomTheme = USERNAME_THEMES[Math.floor(Math.random() * USERNAME_THEMES.length)]
  const adjective = randomTheme.adjectives[Math.floor(Math.random() * randomTheme.adjectives.length)]
  const noun = randomTheme.nouns[Math.floor(Math.random() * randomTheme.nouns.length)]
  return {
    name: `${adjective} ${noun}`,
    themeId: randomTheme.id
  }
}

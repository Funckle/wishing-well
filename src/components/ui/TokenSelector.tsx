'use client'

import { motion } from 'framer-motion'

interface Token {
  id: string
  label: string
}

interface TokenSelectorProps {
  title: string
  tokens: Token[]
  selected: string[]
  maxSelect?: number
  onChange: (selected: string[]) => void
}

export function TokenSelector({
  title,
  tokens,
  selected,
  maxSelect = 1,
  onChange,
}: TokenSelectorProps) {
  const handleSelect = (tokenId: string) => {
    if (selected.includes(tokenId)) {
      onChange(selected.filter((id) => id !== tokenId))
    } else {
      if (maxSelect === 1) {
        onChange([tokenId])
      } else if (selected.length < maxSelect) {
        onChange([...selected, tokenId])
      }
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-stone-600 mb-3 flex items-center justify-between">
        <span>{title}</span>
        {maxSelect > 1 && (
          <span className="text-xs text-stone-400">
            {selected.length}/{maxSelect} selected
          </span>
        )}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tokens.map((token) => {
          const isSelected = selected.includes(token.id)
          return (
            <motion.button
              key={token.id}
              type="button"
              onClick={() => handleSelect(token.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {token.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// Token group system - each starter has compatible descriptors and outcomes
export interface TokenGroup {
  id: string
  starter: Token
  descriptors: Token[]
  outcomes: Token[]
  maxDescriptors: number
}

interface Token {
  id: string
  label: string
}

// Group 1: "You are" type starters (need adjectives)
const youAreDescriptors: Token[] = [
  { id: 'amazing', label: 'amazing' },
  { id: 'incredible', label: 'incredible' },
  { id: 'resilient', label: 'resilient' },
  { id: 'brave', label: 'brave' },
  { id: 'capable', label: 'more capable than you realize' },
  { id: 'strong', label: 'stronger than you know' },
  { id: 'worthy', label: 'worthy of good things' },
  { id: 'enough', label: 'enough, just as you are' },
  { id: 'loved', label: 'loved' },
  { id: 'not-alone', label: 'not alone in this' },
  { id: 'making-progress', label: 'making progress' },
  { id: 'doing-great', label: 'doing better than you think' },
]

const youAreOutcomes: Token[] = [
  { id: 'dont-forget', label: "— don't forget that" },
  { id: 'believe-it', label: '— believe it' },
  { id: 'we-see-it', label: 'and we see it' },
  { id: 'keep-going', label: '— keep going' },
  { id: 'none', label: '' },
]

// Group 2: "Keep/Never stop" starters (need -ing verbs)
const keepDescriptors: Token[] = [
  { id: 'being-you', label: 'being you' },
  { id: 'going', label: 'going' },
  { id: 'pushing', label: 'pushing forward' },
  { id: 'believing', label: 'believing in yourself' },
  { id: 'shining', label: 'shining' },
  { id: 'growing', label: 'growing' },
  { id: 'fighting', label: 'fighting' },
  { id: 'trying', label: 'trying' },
  { id: 'dreaming', label: 'dreaming big' },
  { id: 'being-brave', label: 'being brave' },
  { id: 'showing-up', label: 'showing up' },
  { id: 'taking-steps', label: 'taking small steps' },
]

const keepOutcomes: Token[] = [
  { id: 'got-this', label: "— you've got this" },
  { id: 'cheering', label: "— we're cheering for you" },
  { id: 'proud', label: "— we're proud of you" },
  { id: 'matters', label: '— it matters' },
  { id: 'none', label: '' },
]

// Group 3: "Remember/Never forget" starters (need clauses)
const rememberDescriptors: Token[] = [
  { id: 'you-matter', label: 'you matter' },
  { id: 'youre-loved', label: "you're loved" },
  { id: 'youre-enough', label: "you're enough" },
  { id: 'this-passes', label: 'this will pass' },
  { id: 'not-alone', label: "you're not alone" },
  { id: 'people-care', label: 'people care about you' },
  { id: 'youve-overcome', label: "you've overcome hard things before" },
  { id: 'its-okay', label: "it's okay to struggle" },
  { id: 'youre-worthy', label: "you're worthy of happiness" },
  { id: 'tomorrow-new', label: 'tomorrow is a new day' },
  { id: 'feelings-valid', label: 'your feelings are valid' },
  { id: 'your-best', label: 'your best is enough' },
]

const rememberOutcomes: Token[] = [
  { id: 'always', label: '— always' },
  { id: 'truly', label: '— truly' },
  { id: 'none', label: '' },
]

// Group 4: "I hope/Wishing you" starters (need nouns/states)
const wishingDescriptors: Token[] = [
  { id: 'peace', label: 'peace' },
  { id: 'strength', label: 'strength' },
  { id: 'courage', label: 'courage' },
  { id: 'clarity', label: 'clarity' },
  { id: 'comfort', label: 'comfort' },
  { id: 'healing', label: 'healing' },
  { id: 'joy', label: 'joy' },
  { id: 'rest', label: 'rest' },
  { id: 'hope', label: 'hope' },
  { id: 'brighter-days', label: 'brighter days' },
  { id: 'good-things', label: 'all the good things' },
  { id: 'moments-of-calm', label: 'moments of calm' },
]

const wishingOutcomes: Token[] = [
  { id: 'soon', label: 'soon' },
  { id: 'today', label: 'today' },
  { id: 'always', label: 'always' },
  { id: 'when-needed', label: 'when you need it most' },
  { id: 'none', label: '' },
]

// Group 5: Direct encouragement (standalone phrases)
const directDescriptors: Token[] = [
  { id: 'got-this', label: "You've got this" },
  { id: 'believe-in-you', label: 'I believe in you' },
  { id: 'rooting', label: "I'm rooting for you" },
  { id: 'proud', label: "I'm proud of you" },
  { id: 'can-do-it', label: 'You can do this' },
  { id: 'will-be-okay', label: "It's going to be okay" },
  { id: 'here-for-you', label: "I'm here for you" },
  { id: 'you-inspire', label: 'You inspire me' },
  { id: 'keep-head-up', label: 'Keep your head up' },
  { id: 'one-day-at-time', label: 'One day at a time' },
  { id: 'sending-strength', label: 'Sending you strength' },
  { id: 'hang-in-there', label: 'Hang in there' },
]

const directOutcomes: Token[] = [
  { id: 'seriously', label: '— seriously' },
  { id: 'always', label: '— always' },
  { id: 'promise', label: '— I promise' },
  { id: 'none', label: '' },
]

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    id: 'you-are',
    starter: { id: 'you-are', label: 'You are...' },
    descriptors: youAreDescriptors,
    outcomes: youAreOutcomes,
    maxDescriptors: 2,
  },
  {
    id: 'keep',
    starter: { id: 'keep', label: 'Keep...' },
    descriptors: keepDescriptors,
    outcomes: keepOutcomes,
    maxDescriptors: 2,
  },
  {
    id: 'never-stop',
    starter: { id: 'never-stop', label: 'Never stop...' },
    descriptors: keepDescriptors,
    outcomes: keepOutcomes,
    maxDescriptors: 2,
  },
  {
    id: 'remember',
    starter: { id: 'remember', label: 'Remember:' },
    descriptors: rememberDescriptors,
    outcomes: rememberOutcomes,
    maxDescriptors: 1,
  },
  {
    id: 'never-forget',
    starter: { id: 'never-forget', label: 'Never forget:' },
    descriptors: rememberDescriptors,
    outcomes: rememberOutcomes,
    maxDescriptors: 1,
  },
  {
    id: 'wishing-you',
    starter: { id: 'wishing-you', label: 'Wishing you...' },
    descriptors: wishingDescriptors,
    outcomes: wishingOutcomes,
    maxDescriptors: 2,
  },
  {
    id: 'sending-you',
    starter: { id: 'sending-you', label: 'Sending you...' },
    descriptors: wishingDescriptors,
    outcomes: wishingOutcomes,
    maxDescriptors: 2,
  },
  {
    id: 'direct',
    starter: { id: 'direct', label: 'Say it directly' },
    descriptors: directDescriptors,
    outcomes: directOutcomes,
    maxDescriptors: 1,
  },
]

// Legacy exports for backward compatibility during migration
export const SENTENCE_STARTERS: Token[] = TOKEN_GROUPS.map((g) => g.starter)
export const DESCRIPTORS: Token[] = youAreDescriptors // default
export const OUTCOMES: Token[] = youAreOutcomes // default

// Helper to get descriptors for a starter
export function getDescriptorsForStarter(starterId: string): Token[] {
  const group = TOKEN_GROUPS.find((g) => g.starter.id === starterId)
  return group?.descriptors || youAreDescriptors
}

// Helper to get outcomes for a starter
export function getOutcomesForStarter(starterId: string): Token[] {
  const group = TOKEN_GROUPS.find((g) => g.starter.id === starterId)
  return group?.outcomes || youAreOutcomes
}

// Helper to get max descriptors for a starter
export function getMaxDescriptorsForStarter(starterId: string): number {
  const group = TOKEN_GROUPS.find((g) => g.starter.id === starterId)
  return group?.maxDescriptors || 2
}

export const EMOJIS: Token[] = [
  { id: 'heart', label: '❤️' },
  { id: 'star', label: '⭐' },
  { id: 'fire', label: '🔥' },
  { id: 'sparkles', label: '✨' },
  { id: 'seedling', label: '🌱' },
  { id: 'sunrise', label: '🌅' },
  { id: 'sun', label: '☀️' },
  { id: 'muscle', label: '💪' },
  { id: 'check', label: '✅' },
  { id: 'rocket', label: '🚀' },
  { id: 'rainbow', label: '🌈' },
  { id: 'clap', label: '👏' },
]

// Helper to get display text from token IDs
export function getTokenLabel(tokens: Token[], id: string): string {
  return tokens.find((t) => t.id === id)?.label || id
}

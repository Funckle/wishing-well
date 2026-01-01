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

// Predefined tokens for wish composition
export const SENTENCE_STARTERS: Token[] = [
  { id: 'you-are', label: 'You are' },
  { id: 'you-will', label: 'You will' },
  { id: 'keep', label: 'Keep' },
  { id: 'remember-that', label: 'Remember that' },
  { id: 'i-believe', label: 'I believe in you' },
  { id: 'you-deserve', label: 'You deserve' },
  { id: 'never-forget', label: 'Never forget' },
  { id: 'always-know', label: 'Always know' },
]

export const DESCRIPTORS: Token[] = [
  { id: 'amazing', label: 'amazing' },
  { id: 'resilient', label: 'resilient' },
  { id: 'thoughtful', label: 'thoughtful' },
  { id: 'brave', label: 'braver than you think' },
  { id: 'capable', label: 'capable' },
  { id: 'strong', label: 'stronger than you know' },
  { id: 'worthy', label: 'worthy' },
  { id: 'creative', label: 'creative' },
  { id: 'kind', label: 'kind' },
  { id: 'inspiring', label: 'inspiring' },
  { id: 'unique', label: 'unique' },
  { id: 'brilliant', label: 'brilliant' },
]

export const OUTCOMES: Token[] = [
  { id: 'good-luck', label: 'good luck' },
  { id: 'got-this', label: "you've got this" },
  { id: 'crushing-it', label: 'crushing it' },
  { id: 'keep-shining', label: 'keep shining' },
  { id: 'on-your-way', label: "you're on your way" },
  { id: 'believe-in-you', label: 'we believe in you' },
  { id: 'proud-of-you', label: "we're proud of you" },
  { id: 'rooting-for-you', label: 'rooting for you' },
]

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

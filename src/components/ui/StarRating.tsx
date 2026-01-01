'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface StarRatingProps {
  value: number | null
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizeClasses = {
    sm: 'text-lg gap-1',
    md: 'text-2xl gap-2',
    lg: 'text-4xl gap-3',
  }

  const displayValue = hoverValue ?? value ?? 0

  return (
    <div className={`flex ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          className={`transition-colors ${
            readonly ? 'cursor-default' : 'cursor-pointer'
          }`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(null)}
          disabled={readonly}
          whileHover={readonly ? {} : { scale: 1.2 }}
          whileTap={readonly ? {} : { scale: 0.9 }}
        >
          <span
            className={
              star <= displayValue
                ? 'text-yellow-400 drop-shadow-md'
                : 'text-gray-300'
            }
          >
            ★
          </span>
        </motion.button>
      ))}
      {/* Zero rating option */}
      {!readonly && (
        <motion.button
          type="button"
          className="ml-2 text-sm text-gray-400 hover:text-gray-600"
          onClick={() => onChange?.(0)}
          whileHover={{ scale: 1.05 }}
        >
          (0 stars)
        </motion.button>
      )}
    </div>
  )
}

interface RatingModalProps {
  wish: {
    sentenceStarter: string
    descriptors: string[]
    outcome: string
    emojis: string[]
    customText?: string | null
    gifUrl?: string | null
  }
  onRate: (rating: number) => void
  onClose: () => void
}

export function RatingModal({ wish, onRate, onClose }: RatingModalProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  const wishText = wish.customText ||
    `${wish.sentenceStarter} ${wish.descriptors.join(' + ')} ${wish.outcome}`.trim()

  const handleSubmit = () => {
    if (selectedRating !== null) {
      onRate(selectedRating)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-center text-stone-800 mb-4">
          Rate this wish
        </h2>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 mb-6">
          <p className="text-center text-stone-700 font-medium">{wishText}</p>
          {wish.emojis.length > 0 && (
            <p className="text-center text-lg mt-2">{wish.emojis.join(' ')}</p>
          )}
          {wish.gifUrl && (
            <img
              src={wish.gifUrl}
              alt="GIF"
              className="mt-3 rounded-lg mx-auto max-h-32 object-contain"
            />
          )}
        </div>

        <div className="flex justify-center mb-6">
          <StarRating value={selectedRating} onChange={setSelectedRating} size="lg" />
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 py-3 px-4 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-medium hover:from-amber-500 hover:to-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={selectedRating === null}
          >
            Submit Rating
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

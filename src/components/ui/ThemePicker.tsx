'use client'

import { motion } from 'framer-motion'

interface Theme {
  id: string
  label: string
  emoji: string
}

interface ThemePickerProps<T extends Theme> {
  title: string
  themes: T[]
  selected: string | null
  onChange: (themeId: string) => void
  columns?: 2 | 3
  renderPreview?: (theme: T) => React.ReactNode
}

export function ThemePicker<T extends Theme>({
  title,
  themes,
  selected,
  onChange,
  columns = 3,
  renderPreview,
}: ThemePickerProps<T>) {
  const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-stone-600 mb-3">{title}</h3>
      <div className={`grid ${gridCols} gap-2`}>
        {themes.map((theme) => {
          const isSelected = selected === theme.id
          return (
            <motion.button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              className={`p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-rose-400 bg-rose-50'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {renderPreview ? (
                renderPreview(theme)
              ) : (
                <div className="text-center">
                  <span className="text-2xl block mb-1">{theme.emoji}</span>
                  <span className="text-xs text-stone-600 font-medium">{theme.label}</span>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

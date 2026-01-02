'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import {
  USERNAME_THEMES,
  generateRandomUsername,
  getThemeCombinations,
} from '@/lib/usernameTokens'

interface UsernameGeneratorProps {
  currentUsername?: string | null
  onSave: (username: string) => Promise<{ error: Error | null }>
  onClose: () => void
}

export function UsernameGenerator({
  currentUsername,
  onSave,
  onClose,
}: UsernameGeneratorProps) {
  const supabase = createClient()
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [generatedName, setGeneratedName] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Generate a new name when theme changes or refresh is clicked
  const generateNew = () => {
    if (!selectedTheme) return
    const name = generateRandomUsername(selectedTheme)
    setGeneratedName(name)
    setIsAvailable(null)
    setError(null)
  }

  // Check if the generated name is available
  const checkAvailability = async (name: string) => {
    setIsChecking(true)
    setError(null)

    try {
      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', name)
        .limit(1)
        .single()

      if (queryError && queryError.code === 'PGRST116') {
        // No rows found - name is available
        setIsAvailable(true)
      } else if (data) {
        // Name is taken
        setIsAvailable(false)
      } else {
        setIsAvailable(true)
      }
    } catch {
      setError('Failed to check availability')
    } finally {
      setIsChecking(false)
    }
  }

  // Auto-check availability when name is generated
  useEffect(() => {
    if (generatedName) {
      checkAvailability(generatedName)
    }
  }, [generatedName])

  // Handle save
  const handleSave = async () => {
    if (!generatedName || !isAvailable) return

    setIsSaving(true)
    setError(null)

    const { error: saveError } = await onSave(generatedName)

    if (saveError) {
      setError(saveError.message)
      setIsSaving(false)
    } else {
      onClose()
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
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-800">Choose Your Name</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition"
          >
            ✕
          </button>
        </div>

        {currentUsername && (
          <p className="text-sm text-stone-500 mb-4">
            Current: <span className="font-medium text-stone-700">{currentUsername}</span>
          </p>
        )}

        {/* Theme Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Pick a theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {USERNAME_THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setSelectedTheme(theme.id)
                  setGeneratedName(null)
                  setIsAvailable(null)
                }}
                className={`p-3 rounded-xl text-left transition-all ${
                  selectedTheme === theme.id
                    ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span className="text-lg mr-2">{theme.emoji}</span>
                <span className="font-medium">{theme.label}</span>
                <p className={`text-xs mt-1 ${
                  selectedTheme === theme.id ? 'text-white/80' : 'text-stone-500'
                }`}>
                  {getThemeCombinations(theme.id).toLocaleString()} names
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Name Generator */}
        <AnimatePresence mode="wait">
          {selectedTheme && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Your generated name
              </label>

              <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl p-4 border border-amber-100">
                {generatedName ? (
                  <div className="text-center">
                    <motion.p
                      key={generatedName}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-stone-800 mb-2"
                    >
                      {generatedName}
                    </motion.p>

                    {isChecking ? (
                      <p className="text-sm text-stone-500">Checking availability...</p>
                    ) : isAvailable === true ? (
                      <p className="text-sm text-green-600 font-medium">
                        ✓ This name is available!
                      </p>
                    ) : isAvailable === false ? (
                      <p className="text-sm text-red-500 font-medium">
                        ✗ This name is taken
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-center text-stone-500">
                    Click the button below to generate a name
                  </p>
                )}
              </div>

              <div className="flex justify-center mt-4">
                <Button
                  variant="secondary"
                  onClick={generateNew}
                  icon="🎲"
                >
                  {generatedName ? 'Try Another' : 'Generate Name'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-500 text-sm mb-4 text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!generatedName || !isAvailable || isSaving}
            isLoading={isSaving}
            className="flex-1"
          >
            Save Name
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

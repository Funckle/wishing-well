'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Button, Textarea, Input, ThemePicker } from '@/components/ui'
import { Nav } from '@/components/Nav'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { generateShortCode, getWellUrl } from '@/lib/utils'
import { addDays } from 'date-fns'
import { WELL_THEMES, BACKGROUND_THEMES } from '@/lib/themes'

const WISH_LIMITS = [3, 5, 10, 25, 50, 100]

export default function CreateWellPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const supabase = createClient()

  // Require authentication to create wells
  if (!isLoading && !user) {
    return (
      <main className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100 text-center"
          >
            <div className="text-6xl mb-4">🌟</div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">
              Sign in to Create a Well
            </h1>
            <p className="text-stone-500 mb-6">
              Create an account to open your wishing well, collect wishes,
              and rate them to reward kind wishers.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/login?redirect=/create">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" className="w-full">
                  Send Wishes Instead
                </Button>
              </Link>
            </div>
            <p className="text-stone-400 text-sm mt-6">
              No account? You can still{' '}
              <Link href="/explore" className="text-rose-500 hover:underline">
                send wishes anonymously
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    )
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <main className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-stone-400">Loading...</div>
      </main>
    )
  }

  const [step, setStep] = useState(1)
  const [context, setContext] = useState('')
  const [wishLimit, setWishLimit] = useState(10)
  const [notificationEmail, setNotificationEmail] = useState('')
  const [wellTheme, setWellTheme] = useState('classic')
  const [backgroundTheme, setBackgroundTheme] = useState<string | null>('none')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdWell, setCreatedWell] = useState<{
    shortCode: string
    url: string
  } | null>(null)

  const handleCreate = async () => {
    if (context.trim().length < 10) {
      setError('Please provide more context (at least 10 characters)')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const shortCode = generateShortCode()
      const expiresAt = addDays(new Date(), 7).toISOString()

      const { error: insertError } = await supabase.from('wells').insert({
        short_code: shortCode,
        user_id: user!.id,
        context: context.trim(),
        wish_limit: wishLimit,
        expires_at: expiresAt,
        notification_email: notificationEmail || null,
        well_theme: wellTheme,
        background_theme: backgroundTheme === 'none' ? null : backgroundTheme,
      })

      if (insertError) throw insertError

      const wellUrl = getWellUrl(shortCode)
      setCreatedWell({ shortCode, url: wellUrl })
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create well')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <main className="min-h-screen pt-20 pb-8 px-4">
      <Nav />
      <div className="max-w-xl mx-auto">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s <= step
                  ? 'bg-gradient-to-r from-rose-400 to-pink-500'
                  : 'bg-stone-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Context */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100"
            >
              <h1 className="text-2xl font-bold text-stone-800 mb-2">
                Open a Wishing Well
              </h1>
              <p className="text-stone-500 mb-6">
                Share what you need encouragement for. This helps wish-senders
                craft meaningful wishes.
              </p>

              <Textarea
                label="What's on your mind?"
                placeholder="Job interview coming up... Bad breakup... Need some encouragement..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                maxLength={500}
                showCount
                rows={4}
                className="mb-6"
              />

              <Button onClick={() => setStep(2)} className="w-full" disabled={context.trim().length < 10}>
                Continue
              </Button>

              <p className="text-center text-stone-400 text-sm mt-4">
                You can share your well link anonymously or with friends
              </p>
            </motion.div>
          )}

          {/* Step 2: Settings */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100"
            >
              <h1 className="text-2xl font-bold text-stone-800 mb-2">
                Well Settings
              </h1>
              <p className="text-stone-500 mb-6">
                How many wishes would you like to collect?
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  Number of wishes
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {WISH_LIMITS.map((limit) => (
                    <button
                      key={limit}
                      type="button"
                      onClick={() => setWishLimit(limit)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        wishLimit === limit
                          ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-lg'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {limit}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <ThemePicker
                  title="Well Style"
                  themes={WELL_THEMES}
                  selected={wellTheme}
                  onChange={setWellTheme}
                  columns={3}
                />
              </div>

              <div className="mb-6">
                <ThemePicker
                  title="Background Scene"
                  themes={BACKGROUND_THEMES}
                  selected={backgroundTheme}
                  onChange={setBackgroundTheme}
                  columns={3}
                />
              </div>

              <div className="mb-6">
                <Input
                  type="email"
                  label="Get notified when wishes arrive (optional)"
                  placeholder="your@email.com"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  helperText="We'll email you when new wishes arrive"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm mb-4"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleCreate} isLoading={isSubmitting} className="flex-1">
                  Create Well
                </Button>
              </div>

              <p className="text-center text-stone-400 text-sm mt-4">
                Wells stay open for 7 days or until filled
              </p>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 3 && createdWell && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-6xl mb-4"
              >
                ✨
              </motion.div>

              <h1 className="text-2xl font-bold text-stone-800 mb-2">
                Your Well is Ready!
              </h1>
              <p className="text-stone-500 mb-6">
                Share this link to start collecting wishes
              </p>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-inner border border-stone-100">
                  <QRCodeSVG value={createdWell.url} size={160} />
                </div>
              </div>

              {/* URL */}
              <div className="flex items-center gap-2 mb-6 bg-stone-50 rounded-xl p-3">
                <input
                  type="text"
                  readOnly
                  value={createdWell.url}
                  className="flex-1 bg-transparent text-stone-700 text-sm outline-none"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copyToClipboard(createdWell.url)}
                >
                  Copy
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                <Link href={`/well/${createdWell.shortCode}`}>
                  <Button className="w-full">View Your Well</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

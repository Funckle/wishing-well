'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Button, Textarea, ThemePicker, BackgroundScene, Well } from '@/components/ui'
import { Nav } from '@/components/Nav'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { generateShortCode, getWellUrl } from '@/lib/utils'
import { addDays } from 'date-fns'
import { WELL_THEMES, BACKGROUND_THEMES, getBackgroundThemeById } from '@/lib/themes'

const WISH_LIMITS = [3, 5, 10, 25, 50, 100]

export default function CreateWellPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const supabase = createClient()

  // Require authentication to create wells
  if (!isLoading && !user) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] py-20 px-4 flex items-center justify-center">
        <Nav />
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-organic p-8 text-center"
          >
            <div className="text-6xl mb-4">&#x1F31F;</div>
            <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
              Sign in to Create a Well
            </h1>
            <p className="text-[var(--text-muted)] mb-6">
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
            <p className="text-[var(--text-faded)] text-sm mt-6">
              No account? You can still{' '}
              <Link href="/explore" className="text-[var(--color-coral)] hover:underline">
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
      <main className="min-h-screen bg-[var(--bg-primary)] py-20 px-4 flex items-center justify-center">
        <motion.div
          className="w-10 h-10 border-3 border-[var(--color-coral)] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </main>
    )
  }

  const [step, setStep] = useState(1)
  const [context, setContext] = useState('')
  const [wishLimit, setWishLimit] = useState(10)
  const [wellTheme, setWellTheme] = useState('classic')
  const [backgroundTheme, setBackgroundTheme] = useState<string | null>('none')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdWell, setCreatedWell] = useState<{
    shortCode: string
    url: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

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
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-8 px-4">
      <Nav />
      <div className="max-w-xl mx-auto">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-sm transition-all ${
                  s < step
                    ? 'bg-[var(--color-moss)] text-white'
                    : s === step
                    ? 'bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-terracotta)] text-white shadow-lg'
                    : 'bg-[var(--color-sand)] text-[var(--text-faded)]'
                }`}
                initial={false}
                animate={{ scale: s === step ? 1.1 : 1 }}
              >
                {s < step ? (
                  <span>&#x2713;</span>
                ) : (
                  s
                )}
              </motion.div>
              {s < 3 && (
                <div
                  className={`w-12 h-0.5 mx-2 transition-colors ${
                    s < step ? 'bg-[var(--color-moss)]' : 'bg-[var(--color-sand)]'
                  }`}
                />
              )}
            </div>
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
              className="card-organic p-8"
            >
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-terracotta)] mb-4"
                  whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                >
                  <span className="text-2xl">&#x1FAAB;</span>
                </motion.div>
                <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
                  Open a Wishing Well
                </h1>
                <p className="text-[var(--text-muted)]">
                  Share what you need encouragement for
                </p>
              </div>

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

              <p className="text-center text-[var(--text-faded)] text-sm mt-4">
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
              className="card-organic p-8"
            >
              <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Well Settings
              </h1>
              <p className="text-[var(--text-muted)] mb-6">
                Customize your wishing well
              </p>

              {/* Live Preview */}
              <div className="mb-6">
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">Preview</p>
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] h-48">
                  {(() => {
                    const bgTheme = getBackgroundThemeById(backgroundTheme)
                    const previewContent = (
                      <Well
                        context=""
                        wishCount={0}
                        wishLimit={wishLimit}
                        isActive={true}
                        wellTheme={wellTheme}
                        coins={[]}
                        previewMode
                      />
                    )

                    if (bgTheme) {
                      return (
                        <BackgroundScene theme={bgTheme} preview>
                          {previewContent}
                        </BackgroundScene>
                      )
                    }

                    return (
                      <div className="bg-gradient-to-b from-[var(--color-cream)] to-[var(--color-sand)] h-full">
                        {previewContent}
                      </div>
                    )
                  })()}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                  Number of wishes
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {WISH_LIMITS.map((limit) => (
                    <motion.button
                      key={limit}
                      type="button"
                      onClick={() => setWishLimit(limit)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        wishLimit === limit
                          ? 'bg-gradient-to-br from-[var(--color-coral)] to-[var(--color-terracotta)] text-white shadow-lg'
                          : 'bg-[var(--color-sand)] text-[var(--text-secondary)] hover:bg-[var(--color-clay)] hover:text-[var(--text-primary)]'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {limit}
                    </motion.button>
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

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[var(--color-coral)] text-sm mb-4"
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

              <p className="text-center text-[var(--text-faded)] text-sm mt-4">
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
              className="card-organic p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-6xl mb-4"
              >
                &#x2728;
              </motion.div>

              <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Your Well is Ready!
              </h1>
              <p className="text-[var(--text-muted)] mb-6">
                Share this link to start collecting wishes
              </p>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-inner border border-[var(--border-subtle)]">
                  <QRCodeSVG value={createdWell.url} size={160} />
                </div>
              </div>

              {/* URL */}
              <div className="flex items-center gap-2 mb-6 bg-[var(--color-sand)]/50 rounded-xl p-3">
                <input
                  type="text"
                  readOnly
                  value={createdWell.url}
                  className="flex-1 bg-transparent text-[var(--text-primary)] text-sm outline-none"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copyToClipboard(createdWell.url)}
                >
                  {copied ? 'Copied!' : 'Copy'}
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

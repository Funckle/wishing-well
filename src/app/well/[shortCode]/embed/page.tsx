'use client'

import { useEffect, useState, use } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { getWellUrl } from '@/lib/utils'
import type { Well } from '@/types/database'

type PageParams = Promise<{ shortCode: string }>

export default function EmbedWellPage({ params }: { params: PageParams }) {
  const resolvedParams = use(params)
  const { shortCode } = resolvedParams
  const supabase = createClient()

  const [well, setWell] = useState<Well | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchWell() {
      const { data, error } = await supabase
        .from('wells')
        .select('*')
        .eq('short_code', shortCode)
        .single()

      if (!error && data) {
        setWell(data)
      }
      setIsLoading(false)
    }

    fetchWell()
  }, [supabase, shortCode])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="animate-spin w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!well) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-stone-600">Well not found</p>
        </div>
      </div>
    )
  }

  const progress = (well.wish_count / well.wish_limit) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🌟</span>
        <span className="font-bold text-stone-800">Wishing Well</span>
      </div>

      {/* Well Visual */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-40 h-40 mx-auto mb-6"
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-stone-400 to-stone-600 shadow-xl" />

          {/* Inner water */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-b from-blue-900 to-slate-900 overflow-hidden">
            {/* Sparkles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-sm"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 25}%`,
                }}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                }}
              >
                ✨
              </motion.div>
            ))}

            {/* Coins */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
              {[...Array(Math.min(well.wish_count, 5))].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 opacity-70"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Context */}
        <div className="text-center max-w-xs mb-4">
          <p className="text-stone-700 line-clamp-3">{well.context}</p>
        </div>

        {/* Progress */}
        <div className="w-full max-w-xs mb-4">
          <div className="flex justify-between text-xs text-stone-500 mb-1">
            <span>{well.wish_count} coins</span>
            <span>{well.wish_limit} needed</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-2 mb-4">
          {well.is_active ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Active
            </span>
          ) : (
            <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-medium">
              Closed
            </span>
          )}
          {well.average_rating && (
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              ★ {well.average_rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <a
        href={getWellUrl(shortCode)}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Button className="w-full" size="lg">
          {well.is_active ? 'Send a Wish' : 'View Well'}
        </Button>
      </a>
    </div>
  )
}

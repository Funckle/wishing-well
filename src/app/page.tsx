'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { useAuth } from '@/components/auth/AuthProvider'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌟</span>
            <span className="font-bold text-xl text-stone-800">Wishing Well</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="text-stone-600 hover:text-stone-900 transition">
              Explore Wells
            </Link>
            <Link href="/leaderboard" className="text-stone-600 hover:text-stone-900 transition">
              Leaderboard
            </Link>
            {user ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="outline">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-6 leading-tight">
              Receive wishes when you need them most
            </h1>
            <p className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto">
              Open a wishing well during tough moments and receive thoughtful,
              coin-engraved wishes from kind strangers around the world.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/create">
              <Button size="lg" icon="✨">
                Open a Wishing Well
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="secondary" icon="🪙">
                Send a Wish
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Animated Well Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-md mx-auto"
        >
          <div className="relative">
            {/* Well structure */}
            <div className="w-64 h-64 mx-auto relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-stone-400 to-stone-600 shadow-2xl" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-b from-blue-900 to-slate-900 overflow-hidden">
                {/* Animated sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-lg"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${25 + (i % 3) * 25}%`,
                    }}
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}

                {/* Coins at bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-amber-500"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 0.7, y: 0 }}
                      transition={{ delay: 1 + i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-stone-800 mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* For Well Openers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100"
            >
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-stone-800 mb-3">
                1. Open a Well
              </h3>
              <p className="text-stone-600">
                Share what you need encouragement for. Get a unique link to share
                with friends, family, or the world.
              </p>
            </motion.div>

            {/* For Wish Senders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100"
            >
              <div className="text-4xl mb-4">🪙</div>
              <h3 className="text-xl font-semibold text-stone-800 mb-3">
                2. Send Wishes
              </h3>
              <p className="text-stone-600">
                Compose heartfelt wishes using our token system. Your wish gets
                engraved on a golden coin and tossed into the well.
              </p>
            </motion.div>

            {/* Collecting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100"
            >
              <div className="text-4xl mb-4">🎣</div>
              <h3 className="text-xl font-semibold text-stone-800 mb-3">
                3. Collect & Rate
              </h3>
              <p className="text-stone-600">
                Fish out coins one by one. Each reveals a unique wish. Rate them
                to reward kind wishers with points.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-stone-800 mb-6">
                Earn points, unlock rewards
              </h2>
              <p className="text-stone-600 mb-6">
                Send quality wishes that get high ratings and climb the leaderboard.
                Unlock GIFs at 50 points, custom messages at 100 points, and special
                cosmetics along the way.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-stone-700">
                  <span className="text-amber-500">⭐</span>
                  Rate wishes 0-5 stars
                </li>
                <li className="flex items-center gap-3 text-stone-700">
                  <span className="text-amber-500">🏆</span>
                  Public leaderboard
                </li>
                <li className="flex items-center gap-3 text-stone-700">
                  <span className="text-amber-500">🎁</span>
                  Unlock GIFs and custom wishes
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-2xl font-bold text-stone-800 mb-2">
                  Top Wishers
                </h3>
                <p className="text-stone-600 mb-6">
                  Join the kindness leaderboard
                </p>
                <Link href="/leaderboard">
                  <Button variant="secondary">View Leaderboard</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-100 to-pink-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-800 mb-6">
            Ready to spread some kindness?
          </h2>
          <p className="text-stone-600 mb-8">
            No account required to send wishes. Sign up to open wells and track your impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button size="lg" variant="secondary">
                Browse Active Wells
              </Button>
            </Link>
            <Link href="/create">
              <Button size="lg">
                Create Your Well
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-stone-800 text-stone-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <span className="font-semibold text-white">Wishing Well</span>
          </div>
          <p className="text-sm">
            Spreading kindness, one coin at a time.
          </p>
        </div>
      </footer>
    </main>
  )
}

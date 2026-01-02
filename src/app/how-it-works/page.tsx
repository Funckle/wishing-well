'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Nav } from '@/components/Nav'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

function Section({
  title,
  emoji,
  children,
  delay = 0
}: {
  title: string
  emoji: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{emoji}</span>
        <h2 className="text-2xl font-bold text-stone-800">{title}</h2>
      </div>
      <div className="text-stone-600 space-y-4 pl-12">
        {children}
      </div>
    </motion.section>
  )
}

function FeatureCard({
  emoji,
  title,
  description
}: {
  emoji: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
      <span className="text-2xl mb-2 block">{emoji}</span>
      <h4 className="font-semibold text-stone-800 mb-1">{title}</h4>
      <p className="text-sm text-stone-500">{description}</p>
    </div>
  )
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">
            How Wishing Well Works
          </h1>
          <p className="text-xl text-stone-600 max-w-xl mx-auto">
            A simple guide to spreading and receiving kindness
          </p>
        </motion.div>

        {/* What is Wishing Well */}
        <Section emoji="🌟" title="What is Wishing Well?" delay={0.1}>
          <p>
            Wishing Well is a place for kind words and encouragement. Going through a tough time?
            Open a well and let others send you heartfelt wishes. Feeling generous?
            Toss a coin of kindness into someone else&apos;s well.
          </p>
          <p>
            Every wish is a small coin that lands in the well, ready to brighten someone&apos;s day.
            It&apos;s like a digital hug from strangers who care.
          </p>
        </Section>

        {/* Opening a Well */}
        <Section emoji="✨" title="Opening a Wishing Well" delay={0.2}>
          <p>
            When you need some encouragement, you can open your own wishing well:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li><strong>Share what&apos;s on your mind</strong> — Let people know what you&apos;re going through so they can send relevant wishes</li>
            <li><strong>Choose how many wishes</strong> — Pick from 3 to 100 wishes depending on how much love you want to collect</li>
            <li><strong>Customize your well</strong> — Pick a color theme and background to make it uniquely yours</li>
            <li><strong>Share your link</strong> — Send it to friends, post it online, or keep it anonymous</li>
          </ol>
          <p className="mt-4">
            Your well stays open for 7 days or until it fills up with wishes. You&apos;ll get a unique link and QR code to share.
          </p>
        </Section>

        {/* Sending Wishes */}
        <Section emoji="🪙" title="Sending Wishes" delay={0.3}>
          <p>
            Sending a wish is like tossing a coin into a fountain — it&apos;s a small act that means a lot:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li><strong>Find a well</strong> — Browse active wells or use a shared link</li>
            <li><strong>Compose your wish</strong> — Choose from guided prompts or write your own (if you&apos;ve unlocked custom wishes)</li>
            <li><strong>Add some flair</strong> — Pick emojis and a coin style to personalize your wish</li>
            <li><strong>Toss your coin!</strong> — Watch it splash into the well</li>
          </ol>
          <p className="mt-4">
            You can send wishes anonymously without an account. Sign up to earn points and unlock rewards!
          </p>
        </Section>

        {/* Fishing for Wishes */}
        <Section emoji="🎣" title="Opening Your Wishes" delay={0.4}>
          <p>
            When you receive wishes, they appear as coins in your well. But here&apos;s the fun part —
            you &quot;fish&quot; them out one by one to discover what people wrote!
          </p>
          <p>
            Click the fish button to pull out a coin and reveal the wish inside.
            Then, let the sender know how their wish made you feel:
          </p>

          <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl p-5 border border-amber-100 mt-4">
            <h4 className="font-semibold text-stone-800 mb-3">Rating wishes</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">★★★★★</span>
                <span><strong>3-5 stars:</strong> Saves the wish to your collection — these are your keepers!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">★★☆☆☆</span>
                <span><strong>1-2 stars:</strong> Counts the wish but doesn&apos;t save it — for ones that didn&apos;t quite land</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-stone-400">Skip</span>
                <span><strong>Skip:</strong> Removes the wish entirely — it won&apos;t count or be saved</span>
              </li>
            </ul>
          </div>

          <p className="mt-4">
            Your &quot;Your Wishes&quot; collection only shows the meaningful ones (3+ stars),
            so you can revisit them whenever you need a boost.
          </p>
        </Section>

        {/* Points & Rewards */}
        <Section emoji="🏆" title="Points & Rewards" delay={0.5}>
          <p>
            When you send wishes, the well owner rates them. Higher ratings = more points!
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <FeatureCard
              emoji="⭐"
              title="Earn Points"
              description="Get 1-5 points based on how your wish was rated"
            />
            <FeatureCard
              emoji="📝"
              title="Custom Wishes"
              description="Unlock at 100 points — write anything you want"
            />
            <FeatureCard
              emoji="🎁"
              title="GIF Wishes"
              description="Coming soon — add animated GIFs to your wishes"
            />
            <FeatureCard
              emoji="🥇"
              title="Leaderboard"
              description="Climb the ranks of kindness"
            />
          </div>

          <p className="mt-4">
            Points are tied to your account, so make sure to sign up to keep track of your kindness!
          </p>
        </Section>

        {/* Customization */}
        <Section emoji="🎨" title="Personalization" delay={0.6}>
          <p>
            Make your well and wishes uniquely yours with customization options:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <FeatureCard
              emoji="🏠"
              title="Well Themes"
              description="6 color palettes from Classic to Midnight"
            />
            <FeatureCard
              emoji="🌄"
              title="Background Scenes"
              description="City, beach, mountains, forest & more"
            />
            <FeatureCard
              emoji="🪙"
              title="Coin Styles"
              description="Gold, silver, bronze, rose gold, crystal"
            />
          </div>

          <p className="mt-4">
            Well owners pick their well theme and background. Wish senders choose their coin style.
            Together, you create something beautiful!
          </p>
        </Section>

        {/* Privacy */}
        <Section emoji="🔒" title="Privacy & Safety" delay={0.7}>
          <p>
            We believe kindness should feel safe:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Anonymous sending</strong> — No account needed to send wishes</li>
            <li><strong>Guided messages</strong> — Default wishes are pre-approved to prevent abuse</li>
            <li><strong>Skip button</strong> — Well owners can dismiss any wish they don&apos;t like</li>
            <li><strong>Rate limiting</strong> — Max 5 wishes per hour to prevent spam</li>
            <li><strong>Wells expire</strong> — After 7 days or when filled, wells close automatically</li>
          </ul>
        </Section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-16 bg-white rounded-3xl p-8 shadow-lg border border-stone-100"
        >
          <h2 className="text-2xl font-bold text-stone-800 mb-3">
            Ready to spread some kindness?
          </h2>
          <p className="text-stone-600 mb-6">
            Open a well to receive wishes, or send one to brighten someone&apos;s day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-stone-100 bg-white/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <div className="flex items-center gap-2">
            <span>🌟</span>
            <span className="font-medium text-stone-700">Wishing Well</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-stone-700 transition">Home</Link>
            <Link href="/explore" className="hover:text-stone-700 transition">Explore</Link>
            <Link href="/leaderboard" className="hover:text-stone-700 transition">Leaderboard</Link>
          </div>
          <p className="text-stone-400">Spreading kindness, one coin at a time.</p>
        </div>
      </footer>
    </main>
  )
}

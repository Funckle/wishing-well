'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😅</div>
        <h1 className="text-2xl font-bold text-stone-800 mb-2">
          Something went wrong
        </h1>
        <p className="text-stone-500 mb-6">
          We couldn&apos;t complete your sign in. The link may have expired or been used already.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button>Try Again</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

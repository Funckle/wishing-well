import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

const RATE_LIMIT = 5 // 5 wishes per hour
const WINDOW_MS = 60 * 60 * 1000 // 1 hour in milliseconds

export async function GET() {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
             headersList.get('x-real-ip') ||
             'unknown'

  const supabase = await createClient()
  const now = new Date()
  const windowStart = new Date(now.getTime() - WINDOW_MS)

  // Get existing rate limit record
  const { data: existingLimit } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('ip_address', ip)
    .gte('window_start', windowStart.toISOString())
    .order('window_start', { ascending: false })
    .limit(1)
    .single()

  if (existingLimit) {
    if (existingLimit.wish_count >= RATE_LIMIT) {
      return NextResponse.json({ allowed: false, remaining: 0 })
    }
    return NextResponse.json({
      allowed: true,
      remaining: RATE_LIMIT - existingLimit.wish_count,
    })
  }

  return NextResponse.json({ allowed: true, remaining: RATE_LIMIT })
}

export async function POST() {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
             headersList.get('x-real-ip') ||
             'unknown'

  const supabase = await createClient()
  const now = new Date()
  const windowStart = new Date(now.getTime() - 60 * 60 * 1000)

  // Get existing rate limit record
  const { data: existingLimit } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('ip_address', ip)
    .gte('window_start', windowStart.toISOString())
    .order('window_start', { ascending: false })
    .limit(1)
    .single()

  if (existingLimit) {
    if (existingLimit.wish_count >= RATE_LIMIT) {
      return NextResponse.json({ allowed: false }, { status: 429 })
    }

    // Increment count
    await supabase
      .from('rate_limits')
      .update({ wish_count: existingLimit.wish_count + 1 })
      .eq('id', existingLimit.id)

    return NextResponse.json({ allowed: true })
  }

  // Create new rate limit record
  await supabase.from('rate_limits').insert({
    ip_address: ip,
    wish_count: 1,
    window_start: now.toISOString(),
  })

  return NextResponse.json({ allowed: true })
}

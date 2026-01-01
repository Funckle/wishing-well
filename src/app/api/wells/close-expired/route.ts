import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This endpoint can be called by a cron job to close expired wells
export async function POST(request: Request) {
  // Verify the request is from a trusted source (e.g., cron job service)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // Close expired wells
  const { data, error } = await supabase.rpc('close_expired_wells')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

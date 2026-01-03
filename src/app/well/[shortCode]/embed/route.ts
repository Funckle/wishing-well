import { createClient } from '@/lib/supabase/server'
import { getWellUrl } from '@/lib/utils'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params
  const supabase = await createClient()

  const { data: well } = await supabase
    .from('wells')
    .select('*')
    .eq('short_code', shortCode)
    .single()

  if (!well) {
    const notFoundHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Well Not Found</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to bottom right, #fff1f2, #fce7f3);
      font-family: system-ui, -apple-system, sans-serif;
    }
    .container { text-align: center; }
    .icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .text { color: #57534e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🔍</div>
    <p class="text">Well not found</p>
  </div>
</body>
</html>`

    return new NextResponse(notFoundHtml, {
      status: 404,
      headers: {
        'Content-Type': 'text/html',
        'Content-Security-Policy': "frame-ancestors *",
      },
    })
  }

  const progress = Math.round((well.wish_count / well.wish_limit) * 100)
  const wellUrl = getWellUrl(shortCode)
  const coinCount = Math.min(well.wish_count, 5)
  const coins = Array.from({ length: coinCount }).map(() => '<div class="coin"></div>').join('')

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wishing Well - ${well.context.substring(0, 50)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background: linear-gradient(to bottom right, #fff1f2, #fce7f3);
      font-family: system-ui, -apple-system, sans-serif;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .header-icon { font-size: 1.25rem; }
    .header-text { font-weight: 700; color: #1c1917; }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .well-visual {
      position: relative;
      width: 10rem;
      height: 10rem;
      margin-bottom: 1.5rem;
    }
    .well-outer {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: linear-gradient(to bottom, #a8a29e, #57534e);
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    }
    .well-inner {
      position: absolute;
      inset: 0.75rem;
      border-radius: 50%;
      background: linear-gradient(to bottom, #1e3a8a, #0f172a);
      overflow: hidden;
    }
    .sparkle {
      position: absolute;
      font-size: 0.875rem;
      animation: sparkle 2s ease-in-out infinite;
    }
    .sparkle:nth-child(1) { left: 20%; top: 30%; animation-delay: 0s; }
    .sparkle:nth-child(2) { left: 40%; top: 55%; animation-delay: 0.4s; }
    .sparkle:nth-child(3) { left: 60%; top: 30%; animation-delay: 0.8s; }
    .sparkle:nth-child(4) { left: 80%; top: 55%; animation-delay: 1.2s; }
    @keyframes sparkle {
      0%, 100% { opacity: 0.4; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    .coins {
      position: absolute;
      bottom: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.125rem;
    }
    .coin {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background: linear-gradient(to bottom right, #fcd34d, #f59e0b);
      opacity: 0.7;
    }
    .context {
      text-align: center;
      max-width: 16rem;
      margin-bottom: 1rem;
      color: #44403c;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .progress-container {
      width: 100%;
      max-width: 16rem;
      margin-bottom: 1rem;
    }
    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #78716c;
      margin-bottom: 0.25rem;
    }
    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background: #e7e5e4;
      border-radius: 9999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(to right, #fbbf24, #eab308);
      border-radius: 9999px;
      width: ${progress}%;
    }
    .badges {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .badge-active { background: #dcfce7; color: #15803d; }
    .badge-closed { background: #f5f5f4; color: #57534e; }
    .badge-rating { background: #fef3c7; color: #b45309; }
    .cta {
      display: block;
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(to bottom right, #f43f5e, #e11d48);
      color: white;
      text-align: center;
      text-decoration: none;
      font-weight: 600;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cta:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="header-icon">🌟</span>
    <span class="header-text">Wishing Well</span>
  </div>

  <div class="content">
    <div class="well-visual">
      <div class="well-outer"></div>
      <div class="well-inner">
        <span class="sparkle">✨</span>
        <span class="sparkle">✨</span>
        <span class="sparkle">✨</span>
        <span class="sparkle">✨</span>
        <div class="coins">${coins}</div>
      </div>
    </div>

    <p class="context">${escapeHtml(well.context)}</p>

    <div class="progress-container">
      <div class="progress-labels">
        <span>${well.wish_count} coins</span>
        <span>${well.wish_limit} needed</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    </div>

    <div class="badges">
      ${well.is_active
        ? '<span class="badge badge-active">Active</span>'
        : '<span class="badge badge-closed">Closed</span>'}
      ${well.average_rating
        ? `<span class="badge badge-rating">★ ${well.average_rating.toFixed(1)}</span>`
        : ''}
    </div>
  </div>

  <a href="${wellUrl}" target="_blank" rel="noopener noreferrer" class="cta">
    ${well.is_active ? 'Send a Wish' : 'View Well'}
  </a>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Content-Security-Policy': "frame-ancestors *",
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  })
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

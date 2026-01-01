import { v4 as uuidv4 } from 'uuid'

export function generateShortCode(): string {
  // Generate a short, URL-friendly code
  return uuidv4().slice(0, 8)
}

export function formatTimeRemaining(expiresAt: string): string {
  const now = new Date()
  const expires = new Date(expiresAt)
  const diff = expires.getTime() - now.getTime()

  if (diff <= 0) return 'Expired'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h left`

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${minutes}m left`
}

export function getWellUrl(shortCode: string): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/well/${shortCode}`
}

export function getEmbedCode(shortCode: string): string {
  const url = getWellUrl(shortCode)
  return `<iframe src="${url}/embed" width="400" height="500" frameborder="0" style="border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></iframe>`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

import { createClient } from '@/lib/supabase/server'
import { getWellUrl } from '@/lib/utils'
import { EmbedWellContent } from './EmbedWellContent'

type PageParams = Promise<{ shortCode: string }>

export default async function EmbedWellPage({ params }: { params: PageParams }) {
  const { shortCode } = await params
  const supabase = await createClient()

  const { data: well } = await supabase
    .from('wells')
    .select('*')
    .eq('short_code', shortCode)
    .single()

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

  return (
    <EmbedWellContent
      well={well}
      shortCode={shortCode}
      wellUrl={getWellUrl(shortCode)}
    />
  )
}

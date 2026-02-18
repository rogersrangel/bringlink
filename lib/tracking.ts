import { createClient } from "@/lib/supabase/server"

export interface ClickData {
  productId: string
  userId: string
  ip?: string
  country?: string
  city?: string
  deviceType?: string
  browser?: string
  referrer?: string
}

export async function registerClick(data: ClickData) {
  const supabase = await createClient()

  // Registrar o clique
  const { error: clickError } = await supabase
    .from('clicks')
    .insert({
      product_id: data.productId,
      user_id: data.userId,
      ip_address: data.ip,
      country: data.country,
      city: data.city,
      device_type: data.deviceType,
      browser: data.browser,
      referrer: data.referrer,
      clicked_at: new Date().toISOString()
    })

  if (clickError) {
    console.error('Erro ao registrar clique:', clickError)
    return
  }

  // Atualizar contador de cliques no produto
  await supabase.rpc('increment_product_clicks', {
    product_id: data.productId
  })
}
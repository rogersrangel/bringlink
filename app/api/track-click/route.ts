import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { getGeoData } from "@/lib/geolocation"

export async function POST(request: NextRequest) {
  try {
    const { productId, userId } = await request.json()
    
    if (!productId || !userId) {
      return NextResponse.json(
        { error: 'productId e userId são obrigatórios' },
        { status: 400 }
      )
    }

    // Pegar IP real
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'desconhecido'
    
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''

    // Detectar dispositivo
    const deviceType = detectDevice(userAgent)
    const browser = detectBrowser(userAgent)

    // Buscar geolocalização
    const geoData = await getGeoData(ip)

    const supabase = await createClient()

    // Registrar o clique COM geolocalização
    const { error: clickError } = await supabase
      .from('clicks')
      .insert({
        product_id: productId,
        user_id: userId,
        ip_address: ip,
        country: geoData?.country,
        city: geoData?.city,
        device_type: deviceType,
        browser,
        referrer,
        clicked_at: new Date().toISOString()
      })

    if (clickError) {
      console.error('Erro ao registrar clique:', clickError)
      return NextResponse.json(
        { error: 'Erro ao registrar clique' },
        { status: 500 }
      )
    }

    // Atualizar contador no produto
    await supabase.rpc('increment_product_clicks', {
      product_id: productId
    })

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Erro no tracking:', error)
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    )
  }
}
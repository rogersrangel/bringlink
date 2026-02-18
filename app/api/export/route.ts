import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const format = searchParams.get('format') || 'csv'
  const period = searchParams.get('period') || '7d'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Buscar dados do período
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - (period === '30d' ? 30 : period === '90d' ? 90 : 7))

  const { data: clicks } = await supabase
    .from('clicks')
    .select(`
      *,
      products (title)
    `)
    .eq('user_id', user.id)
    .gte('clicked_at', startDate.toISOString())
    .order('clicked_at', { ascending: false })

  if (format === 'csv') {
    // Gerar CSV
    const csv = [
      ['Data', 'Produto', 'País', 'Cidade', 'Dispositivo', 'IP'].join(','),
      ...clicks.map(click => [
        new Date(click.clicked_at).toLocaleString('pt-BR'),
        click.products?.title || 'Produto removido',
        click.country || '',
        click.city || '',
        click.device_type || '',
        click.ip_address || ''
      ].join(','))
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=relatorio-${period}-${new Date().toISOString().split('T')[0]}.csv`
      }
    })
  }

  // JSON format
  return NextResponse.json(clicks)
}
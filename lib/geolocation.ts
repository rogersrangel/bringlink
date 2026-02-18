export interface GeoData {
  country: string
  city: string
  region: string
  latitude: number
  longitude: number
  timezone: string
}

export async function getGeoData(ip: string): Promise<Partial<GeoData> | null> {
  try {
    // Para IPs locais/desenvolvimento, retorna null
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'desconhecido') {
      return null
    }

    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'BringLink/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`)
    }

    const data = await response.json()
    
    // Verificar se a API retornou erro
    if (data.error) {
      console.error('Erro ipapi.co:', data.reason)
      return null
    }

    return {
      country: data.country_name,
      city: data.city,
      region: data.region,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone
    }
  } catch (error) {
    console.error('Erro ao buscar geolocalização:', error)
    return null
  }
}
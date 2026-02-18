export async function getGeoData(ip: string) {
  try {
    // Para IPs locais, retorna null (evita erro)
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'desconhecido') {
      return null;
    }

    // Usando ipapi.co (gratuito, 30k req/mês)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'BringLink/1.0' }
    });

    if (!response.ok) return null;

    const data = await response.json();
    
    return {
      country: data.country_name,
      city: data.city,
      region: data.region,
    };
  } catch (error) {
    console.error('Erro na geolocalização:', error);
    return null;
  }
}
import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    console.log('🎯 Scraping URL:', url)
    
    // Buscar o HTML da página
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    const html = await response.text()
    const $ = cheerio.load(html)

    // Detectar plataforma
    const platform = detectPlatform(url)
    console.log('📦 Platform:', platform)

    // Extrair dados
    const product = {
      title: extractTitle($, platform) || 
             $('meta[property="og:title"]').attr('content') || 
             $('meta[name="twitter:title"]').attr('content') ||
             $('h1').first().text()?.trim() || 'Produto',
      
      image: extractImage($, platform),  // ← Usando função específica
      
      price: extractPrice($, platform),
      
      platform: platform
    }

    console.log('✅ Produto extraído:', product)
    return NextResponse.json(product)
  } catch (error) {
    console.error('❌ Erro no scraping:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}

// 🔥 NOVA FUNÇÃO PARA EXTRAIR IMAGEM
function extractImage($: any, platform: string) {
  console.log(`🔍 Buscando imagem para plataforma: ${platform}`)
  
  // Seletores específicos por plataforma
  const platformSelectors: Record<string, string[]> = {
    amazon: [
      '#landingImage',
      '#imgBlkFront',
      '.a-dynamic-image',
      'img[data-old-hires]',
      'img[data-a-image-name="landingImage"]'
    ],
    mercadolivre: [
      '.ui-pdp-gallery__figure img',
      '.ui-pdp-image',
      'meta[property="og:image"]'
    ],
    shopee: [
      'img[data-testid="image"]',
      '._8Z2Upx img',
      'meta[property="og:image"]'
    ],
    aliexpress: [
      '.image-viewer__image',
      '.magnifier-image',
      'meta[property="og:image"]'
    ]
  }

  // Primeiro tenta seletores específicos da plataforma
  const selectors = platformSelectors[platform] || []
  
  for (const selector of selectors) {
    try {
      const element = $(selector)
      if (element.length) {
        let imageUrl = element.attr('src') || 
                      element.attr('data-src') || 
                      element.attr('data-old-hires')
        
        if (imageUrl) {
          // Corrige URLs relativas
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl
          }
          console.log(`📸 Imagem encontrada com seletor "${selector}":`, imageUrl)
          return imageUrl
        }
      }
    } catch (e) {
      console.log(`❌ Erro no seletor ${selector}:`, e)
    }
  }

  // Fallback para meta tags
  const metaImage = $('meta[property="og:image"]').attr('content') ||
                    $('meta[name="twitter:image"]').attr('content')
  
  if (metaImage) {
    console.log('📸 Imagem encontrada via meta tag:', metaImage)
    return metaImage.startsWith('//') ? 'https:' + metaImage : metaImage
  }

  console.log('❌ Nenhuma imagem encontrada')
  return null
}

function extractTitle($: any, platform: string) {
  console.log(`🔍 Buscando título para plataforma: ${platform}`)
  
  const platformSelectors: Record<string, string[]> = {
    amazon: [
      '#productTitle',
      'span#productTitle',
      'meta[property="og:title"]'
    ],
    mercadolivre: [
      'h1.ui-pdp-title',
      '.ui-pdp-title',
      'meta[property="og:title"]'
    ],
    shopee: [
      '[data-testid="product-title"]',
      'div[class*="product-title"]',
      'meta[property="og:title"]'
    ],
    aliexpress: [
      'h1[class*="title"]',
      '.product-title',
      'meta[property="og:title"]'
    ]
  }

  const selectors = platformSelectors[platform] || ['meta[property="og:title"]', 'h1']
  
  for (const selector of selectors) {
    try {
      const element = $(selector)
      if (element.length) {
        let title = element.attr('content') || element.text()
        if (title) {
          console.log(`📐 Título encontrado com seletor "${selector}":`, title.trim())
          return title.trim()
        }
      }
    } catch (e) {
      console.log(`❌ Erro no seletor ${selector}:`, e)
    }
  }
  
  return null
}

function extractPrice($: any, platform: string) {
  console.log(`🔍 Buscando preço para plataforma: ${platform}`)
  
  const platformSelectors: Record<string, string[]> = {
    amazon: [
      '.a-price .a-offscreen',
      '#price_inside_buybox',
      '.a-price-whole',
      'span.a-price[data-a-size="xl"] span.a-offscreen',
      'meta[property="product:price:amount"]'
    ],
    mercadolivre: [
      '.andes-money-amount__fraction',
      '.ui-pdp-price__second-line .andes-money-amount__fraction',
      '[itemprop="price"]',
      'meta[property="product:price:amount"]'
    ],
    shopee: [
      '[data-testid="product-price"]',
      '._3n5NQx span',
      'div[class*="product-price"]',
      'meta[itemprop="price"]',
      'meta[property="product:price:amount"]'
    ],
    aliexpress: [
      '.product-price-value',
      '[itemprop="price"]',
      '.sku-price',
      '.pdp-price',
      'div[class*="Price"] span',
      'meta[property="product:price:amount"]'
    ]
  }

  const selectors = platformSelectors[platform] || []
  
  const genericSelectors = [
    'meta[property="product:price:amount"]',
    'meta[itemprop="price"]',
    'meta[name="price"]',
    '.price',
    '.product-price',
    '[data-price]',
    '.sale-price',
    '.current-price'
  ]
  
  const allSelectors = [...selectors, ...genericSelectors]

  for (const selector of allSelectors) {
    try {
      const element = $(selector)
      if (element.length) {
        let price = element.attr('content') || 
                    element.attr('data-price') || 
                    element.text()
        
        if (price) {
          console.log(`📐 Seletor "${selector}" encontrado: "${price}"`)
          
          let cleaned = price
            .replace(/[R$\s]/g, '')
            .replace(/\./g, '')
            .replace(',', '.')
            .replace(/[^0-9.]/g, '')
            .trim()
          
          // Ajuste para Amazon (remove textos duplicados)
          if (platform === 'amazon') {
            const amazonMatch = price.match(/(\d+[.,]\d{2})/)
            if (amazonMatch) {
              cleaned = amazonMatch[1].replace(',', '.')
            }
          }
          
          // Ajuste para Mercado Livre (preços em centavos)
          if (platform === 'mercadolivre' && cleaned.length > 5) {
            const mlMatch = price.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/)
            if (mlMatch) {
              cleaned = mlMatch[1].replace(/\./g, '').replace(',', '.')
            }
          }
          
          const match = cleaned.match(/(\d+(?:\.\d+)?)/)
          if (match) {
            const parsed = parseFloat(match[1])
            if (!isNaN(parsed) && parsed > 0 && parsed < 1000000) {
              console.log(`✅ Preço encontrado: ${parsed}`)
              return parsed
            }
          }
        }
      }
    } catch (e) {
      console.log(`❌ Erro no seletor ${selector}:`, e)
    }
  }
  
  // Fallback
  console.log('🔍 Tentando fallback...')
  const bodyText = $('body').text()
  const pricePatterns = [
    /R?\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/,
    /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))\s*reais/,
    /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/
  ]
  
  for (const pattern of pricePatterns) {
    const match = bodyText.match(pattern)
    if (match) {
      let found = match[1].replace(/\./g, '').replace(',', '.')
      const parsed = parseFloat(found)
      if (!isNaN(parsed) && parsed > 0 && parsed < 1000000) {
        console.log(`✅ Preço encontrado no fallback: ${parsed}`)
        return parsed
      }
    }
  }
  
  console.log('❌ Nenhum preço encontrado')
  return null
}

function detectPlatform(url: string) {
  if (url.includes('shopee')) return 'shopee'
  if (url.includes('aliexpress')) return 'aliexpress'
  if (url.includes('mercadolivre') || url.includes('mercadolibre')) return 'mercadolivre'
  if (url.includes('amazon')) return 'amazon'
  return 'other'
}
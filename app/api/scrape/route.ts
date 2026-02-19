import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    console.log('🎯 Scraping URL:', url)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const html = await response.text()
    const $ = cheerio.load(html)

    const platform = detectPlatform(url)
    console.log('📦 Platform:', platform)

    let product: any = {
      title: null,
      original_price: null,
      discounted_price: null,
      image: null,
      platform
    }

    switch(platform) {
      case 'amazon':
        product = extractAmazon($, product)
        break
      case 'mercadolivre':
        product = extractMercadoLivre($, product)
        break
      case 'shopee':
        product = extractShopee($, product, html)
        break
      case 'aliexpress':
        product = extractAliExpress($, product, html)
        break
      default:
        product = extractGeneric($, product)
    }

    console.log('✅ Produto extraído:', product)
    return NextResponse.json(product)
  } catch (error) {
    console.error('❌ Erro no scraping:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}

// 🟦 AMAZON - CORRIGIDO (preços nos campos certos)
function extractAmazon($: any, product: any) {
  console.log('🔍 Extraindo Amazon...')
  
  // Título
  product.title = $('#productTitle').text().trim() ||
                  $('meta[property="og:title"]').attr('content') ||
                  'Produto Amazon'

  // Imagem
  product.image = $('#landingImage').attr('src') ||
                  $('#imgBlkFront').attr('src') ||
                  $('meta[property="og:image"]').attr('content')

  // 🔥 PREÇO ORIGINAL (tachado) - Ex: R$313,20
  const originalPriceText = $('.a-price.a-text-price span.a-offscreen').first().text()
  const originalMatch = originalPriceText.match(/(\d+[.,]\d+)/)
  if (originalMatch) {
    product.original_price = parseFloat(originalMatch[1].replace(',', '.'))
  }

  // 🔥 PREÇO COM DESCONTO (atual) - Ex: R$195,44
  const priceWhole = $('.a-price-whole').first().text().replace(/[.,]/g, '')
  const priceFraction = $('.a-price-fraction').first().text()
  
  if (priceWhole) {
    const currentPrice = parseFloat(priceWhole + (priceFraction ? '.' + priceFraction : ''))
    product.discounted_price = currentPrice
  }

  // Fallback: se não encontrou original, usa o desconto como original
  if (!product.original_price) {
    product.original_price = product.discounted_price
  }

  return product
}

// 🟦 MERCADO LIVRE - VERSÃO FINAL E DEFINITIVA
function extractMercadoLivre($: any, product: any) {
  console.log('🔍 Extraindo Mercado Livre...')
  
  // Título
  product.title = $('h1.ui-pdp-title').text().trim() ||
                  $('meta[property="og:title"]').attr('content') ||
                  'Produto Mercado Livre'

  // Imagem
  product.image = $('meta[property="og:image"]').attr('content') ||
                  $('.ui-pdp-gallery__figure img').attr('src')

  // 🔥 ESTRATÉGIA: Encontrar o PREÇO PROMOCIONAL (com desconto)
  let discountedPrice: number | null = null
  let originalPrice: number | null = null

  // 1. Primeiro, procura especificamente pelo preço que tem o selo de desconto
  // O seletor '.ui-pdp-price__second-line' geralmente contém o preço promocional
  const promoPriceElement = $('.ui-pdp-price__second-line .andes-money-amount').first()
  if (promoPriceElement.length) {
    const priceText = promoPriceElement.find('.andes-money-amount__fraction').first().text()
    if (priceText) {
      const cleanPrice = priceText.replace(/\./g, '')
      let price = parseFloat(cleanPrice)
      
      const centsElement = promoPriceElement.find('.andes-money-amount__cents').first()
      if (centsElement.length) {
        const cents = centsElement.text()
        price = parseFloat(cleanPrice + '.' + cents)
      }
      discountedPrice = price
      console.log(`💰 Preço promocional encontrado: ${discountedPrice}`)
    }
  }

  // 2. Depois, procura o preço original (tachado ou "De:")
  const originalPriceElement = $('.andes-money-amount--previous .andes-money-amount__fraction')
  if (originalPriceElement.length) {
    const originalText = originalPriceElement.text().replace(/\./g, '')
    let original = parseFloat(originalText)
    
    const originalCents = $('.andes-money-amount--previous .andes-money-amount__cents').text()
    if (originalCents) {
      original = parseFloat(originalText + '.' + originalCents)
    }
    originalPrice = original
    console.log(`💰 Preço original (de comparação) encontrado: ${originalPrice}`)
  }

  // 3. Se não encontrou o promocional, tenta o primeiro preço que não seja o original
  if (!discountedPrice) {
    $('.andes-money-amount.ui-pdp-price__part').each((i: number, el: any) => {
      // Pula o elemento que é o preço original (se já identificamos)
      if (originalPriceElement.length && $(el).hasClass('andes-money-amount--previous')) {
        return
      }
      
      const priceText = $(el).find('.andes-money-amount__fraction').first().text()
      if (priceText) {
        const cleanPrice = priceText.replace(/\./g, '')
        let price = parseFloat(cleanPrice)
        
        const centsElement = $(el).find('.andes-money-amount__cents').first()
        if (centsElement.length) {
          const cents = centsElement.text()
          price = parseFloat(cleanPrice + '.' + cents)
        }
        
        // Se o preço for menor que o original (caso tenha encontrado), é o promocional
        if (originalPrice && price < originalPrice) {
          discountedPrice = price
          console.log(`💰 Preço promocional (menor que original) encontrado: ${discountedPrice}`)
          return false // break do each
        } else if (!originalPrice) {
          // Se não tem original, pega o primeiro preço que não seja muito baixo
          if (price > 10) { // Filtra valores irreais como 14,43 de parcela
            discountedPrice = price
            console.log(`💰 Primeiro preço razoável encontrado: ${discountedPrice}`)
            return false
          }
        }
      }
    })
  }

  // 4. Define os preços no produto
  if (discountedPrice) {
    product.discounted_price = discountedPrice
    product.original_price = originalPrice || discountedPrice
  } else {
    // Fallback para caso tudo falhe
    console.log('⚠️ Nenhum preço encontrado, usando fallback')
    const allPriceTexts: number[] = []
    $('.andes-money-amount__fraction').each((i: number, el: any) => {
      const val = parseFloat($(el).text().replace(/\./g, ''))
      if (!isNaN(val) && val > 0) allPriceTexts.push(val)
    })
    if (allPriceTexts.length > 0) {
      const sorted = allPriceTexts.sort((a, b) => a - b)
      product.discounted_price = sorted[0] // Pega o menor preço
      product.original_price = sorted[sorted.length - 1] // Pega o maior preço
    }
  }

  return product
}

// 🟦 SHOPEE - CORRIGIDO (extrai do HTML)
function extractShopee($: any, product: any, html: string) {
  console.log('🔍 Extraindo Shopee...')
  
  // Título
  product.title = $('meta[property="og:title"]').attr('content') ||
                  $('div[class*="product-title"]').text().trim() ||
                  $('div[data-testid="product-title"]').text().trim() ||
                  $('h1').first().text().trim() ||
                  'Produto Shopee'

  // Imagem
  product.image = $('meta[property="og:image"]').attr('content') ||
                  $('img[data-testid="image"]').attr('src') ||
                  $('img[class*="product-image"]').attr('src')

  // 🔥 EXTRAIR PREÇO DO HTML (Shopee tem dados em JSON)
  // Procura por padrões de preço no formato "price": 4990 (centavos)
  const priceMatch = html.match(/"price":\s*(\d+)/) || 
                     html.match(/"price_min":\s*(\d+)/) ||
                     html.match(/"price_max":\s*(\d+)/)
  
  if (priceMatch) {
    const priceInCents = parseInt(priceMatch[1])
    product.discounted_price = priceInCents / 100
    product.original_price = product.discounted_price
  }

  // Se não encontrou no JSON, tenta no texto
  if (!product.discounted_price) {
    const bodyText = $('body').text()
    const textMatch = bodyText.match(/R?\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/)
    if (textMatch) {
      const price = parseFloat(textMatch[1].replace(/\./g, '').replace(',', '.'))
      product.discounted_price = price
      product.original_price = price
    }
  }

  return product
}

// 🟦 ALIEXPRESS - CORRIGIDO (extrai do HTML)
function extractAliExpress($: any, product: any, html: string) {
  console.log('🔍 Extraindo AliExpress...')
  
  // Título
  product.title = $('meta[property="og:title"]').attr('content') ||
                  $('h1[class*="title"]').text().trim() ||
                  $('div[class*="product-title"]').text().trim() ||
                  'Produto AliExpress'

  // Imagem
  product.image = $('meta[property="og:image"]').attr('content') ||
                  $('.image-viewer__image').attr('src') ||
                  $('img[class*="product-image"]').attr('src')

  // 🔥 EXTRAIR PREÇO DO HTML (AliExpress tem dados em JSON)
  const priceMatch = html.match(/"skuPrice":\s*\{\s*"minActivityAmount":\s*\{\s*"value":\s*([\d.]+)/) ||
                     html.match(/"price":\s*([\d.]+)/) ||
                     html.match(/"promotionPrice":\s*([\d.]+)/)
  
  if (priceMatch) {
    product.discounted_price = parseFloat(priceMatch[1])
    product.original_price = product.discounted_price
  }

  // Se não encontrou no JSON, tenta no texto
  if (!product.discounted_price) {
    const bodyText = $('body').text()
    const textMatch = bodyText.match(/R?\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/)
    if (textMatch) {
      const price = parseFloat(textMatch[1].replace(/\./g, '').replace(',', '.'))
      product.discounted_price = price
      product.original_price = price
    }
  }

  return product
}

// 🟦 GENÉRICO (fallback)
function extractGeneric($: any, product: any) {
  product.title = $('meta[property="og:title"]').attr('content') || 'Produto'
  product.image = $('meta[property="og:image"]').attr('content')
  
  const bodyText = $('body').text()
  const priceMatch = bodyText.match(/R?\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/)
  if (priceMatch) {
    const price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'))
    product.discounted_price = price
    product.original_price = price
  }
  
  return product
}

function detectPlatform(url: string) {
  if (url.includes('shopee')) return 'shopee'
  if (url.includes('aliexpress')) return 'aliexpress'
  if (url.includes('mercadolivre') || url.includes('mercadolibre')) return 'mercadolivre'
  if (url.includes('amazon')) return 'amazon'
  return 'other'
}
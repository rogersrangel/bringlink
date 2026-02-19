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

// 🟦 MERCADO LIVRE - VERSÃO FINAL ROBUSTA
function extractMercadoLivre($: any, product: any) {
  console.log('🔍 Extraindo Mercado Livre...')
  
  // Título
  product.title = $('h1.ui-pdp-title').text().trim() ||
                  $('meta[property="og:title"]').attr('content') ||
                  'Produto Mercado Livre'

  // Imagem
  product.image = $('meta[property="og:image"]').attr('content') ||
                  $('.ui-pdp-gallery__figure img').attr('src')

  // 🔥 ESTRATÉGIA FINAL: Encontrar o PREÇO PRINCIPAL da página
  let mainPrice: number | null = null

  // 1. Primeiro, tenta o seletor específico do preço à vista (mais confiável)
  const cashPriceElement = $('.andes-money-amount.ui-pdp-price__part').first()
  const cashPriceText = cashPriceElement.find('.andes-money-amount__fraction').first().text()
  
  if (cashPriceText) {
    const cleanPrice = cashPriceText.replace(/\./g, '')
    let price = parseFloat(cleanPrice)
    
    const centsElement = cashPriceElement.find('.andes-money-amount__cents').first()
    if (centsElement.length) {
      const cents = centsElement.text()
      price = parseFloat(cleanPrice + '.' + cents)
    }
    mainPrice = price
    console.log(`💰 Preço à vista encontrado: ${mainPrice}`)
  }

  // 2. Se não encontrou, tenta o elemento de preço que está visível na página
  if (!mainPrice) {
    const visiblePriceElement = $('.ui-pdp-price__second-line .andes-money-amount__fraction').first()
    if (visiblePriceElement.length) {
      const visiblePriceText = visiblePriceElement.text().replace(/\./g, '')
      mainPrice = parseFloat(visiblePriceText)
      console.log(`💰 Preço visível encontrado: ${mainPrice}`)
    }
  }

  // 3. Fallback: coleta todos os preços e filtra os que fazem sentido
  if (!mainPrice) {
    let allPrices: number[] = []
    $('.andes-money-amount__fraction').each((i: number, el: any) => {
      const priceText = $(el).text().replace(/\./g, '')
      const price = parseFloat(priceText)
      if (!isNaN(price) && price > 0) {
        allPrices.push(price)
      }
    })

    if (allPrices.length > 0) {
      // Remove outliers (preços muito baixos ou muito altos)
      const sortedPrices = allPrices.sort((a, b) => a - b)
      const reasonablePrices = sortedPrices.filter(p => p > 10 && p < 10000) // Filtra preços irreais
      
      if (reasonablePrices.length > 0) {
        // Pega o menor preço razoável (geralmente o à vista)
        mainPrice = reasonablePrices[0]
        console.log(`💰 Menor preço razoável encontrado: ${mainPrice}`)
        console.log(`   (de um total de ${allPrices.length} preços na página)`)
      }
    }
  }

  // 4. Define os preços no produto
  if (mainPrice) {
    product.discounted_price = mainPrice
    product.original_price = mainPrice
  }

  // 5. Tenta encontrar preço original (tachado) separadamente
  const originalElement = $('.andes-money-amount--previous .andes-money-amount__fraction')
  if (originalElement.length) {
    const originalText = originalElement.text().replace(/\./g, '')
    let originalPrice = parseFloat(originalText)
    
    const originalCents = $('.andes-money-amount--previous .andes-money-amount__cents').text()
    if (originalCents) {
      originalPrice = parseFloat(originalText + '.' + originalCents)
    }
    product.original_price = originalPrice
    console.log(`💰 Preço original (tachado) encontrado: ${originalPrice}`)
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
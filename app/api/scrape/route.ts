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

    // Extrair dados baseado na plataforma
    switch(platform) {
      case 'amazon':
        product = await extractAmazon($, product)
        break
      case 'mercadolivre':
        product = await extractMercadoLivre($, product)
        break
      case 'shopee':
        product = await extractShopee($, product)
        break
      case 'aliexpress':
        product = await extractAliExpress($, product)
        break
      default:
        product = await extractGeneric($, product)
    }

    console.log('✅ Produto extraído:', product)
    return NextResponse.json(product)
  } catch (error) {
    console.error('❌ Erro no scraping:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}

// 🟦 AMAZON
async function extractAmazon($: any, product: any) {
  console.log('🔍 Extraindo Amazon...')
  
  // Título
  product.title = $('#productTitle').text().trim() ||
                  $('meta[property="og:title"]').attr('content') ||
                  'Produto Amazon'

  // Imagem
  product.image = $('#landingImage').attr('src') ||
                  $('#imgBlkFront').attr('src') ||
                  $('meta[property="og:image"]').attr('content')

  // Preços
  const priceWhole = $('.a-price-whole').first().text().replace(/[.,]/g, '')
  const priceFraction = $('.a-price-fraction').first().text()
  
  if (priceWhole) {
    const currentPrice = parseFloat(priceWhole + (priceFraction ? '.' + priceFraction : ''))
    product.discounted_price = currentPrice
    
    // Tenta pegar o preço original (tachado)
    const originalText = $('.a-price.a-text-price span.a-offscreen').first().text()
    const originalMatch = originalText.match(/R?\$?\s*(\d+[.,]\d+)/)
    if (originalMatch) {
      product.original_price = parseFloat(originalMatch[1].replace(',', '.'))
    } else {
      product.original_price = currentPrice
    }
  }

  return product
}

// 🟦 MERCADO LIVRE
async function extractMercadoLivre($: any, product: any) {
  console.log('🔍 Extraindo Mercado Livre...')
  
  // Título
  product.title = $('h1.ui-pdp-title').text().trim() ||
                  $('meta[property="og:title"]').attr('content') ||
                  'Produto Mercado Livre'

  // Imagem
  product.image = $('meta[property="og:image"]').attr('content') ||
                  $('.ui-pdp-gallery__figure img').attr('src')

  // Preços
  const currentPriceElement = $('.andes-money-amount.ui-pdp-price__part').first()
  const currentPriceText = currentPriceElement.find('.andes-money-amount__fraction').text().replace(/\./g, '')
  
  if (currentPriceText) {
    product.discounted_price = parseFloat(currentPriceText) / 100 // Divide por 100 porque vem em centavos
  }

  // Preço original (tachado)
  const originalPriceElement = $('.andes-money-amount--previous .andes-money-amount__fraction')
  if (originalPriceElement.length) {
    const originalText = originalPriceElement.text().replace(/\./g, '')
    product.original_price = parseFloat(originalText) / 100
  } else {
    product.original_price = product.discounted_price
  }

  return product
}

// 🟦 SHOPEE
async function extractShopee($: any, product: any) {
  console.log('🔍 Extraindo Shopee...')
  
  // Título
  product.title = $('meta[property="og:title"]').attr('content') ||
                  $('div[class*="product-title"]').text().trim() ||
                  'Produto Shopee'

  // Imagem
  product.image = $('meta[property="og:image"]').attr('content') ||
                  $('img[data-testid="image"]').attr('src')

  // Preços - Shopee tem estrutura complexa com JavaScript
  // Tenta encontrar no texto da página
  const bodyText = $('body').text()
  
  // Procura por padrões de preço no formato "R$49,90" ou "R$ 49,90"
  const priceMatch = bodyText.match(/R?\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/)
  if (priceMatch) {
    const price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'))
    product.discounted_price = price
    
    // Procura por preço original (tachado) - geralmente aparece como "R$129,90" próximo ao preço
    const originalMatch = bodyText.match(/R?\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))(?=[^]*?R?\$\s*\d+)/)
    if (originalMatch) {
      product.original_price = parseFloat(originalMatch[1].replace(/\./g, '').replace(',', '.'))
    } else {
      product.original_price = price
    }
  }

  return product
}

// 🟦 ALIEXPRESS
async function extractAliExpress($: any, product: any) {
  console.log('🔍 Extraindo AliExpress...')
  
  // Título
  product.title = $('meta[property="og:title"]').attr('content') ||
                  $('h1[class*="title"]').text().trim() ||
                  'Produto AliExpress'

  // Imagem
  product.image = $('meta[property="og:image"]').attr('content') ||
                  $('.image-viewer__image').attr('src')

  // Preços - AliExpress tem preço promocional e original
  const discountPriceElement = $('.product-price-value').first()
  const originalPriceElement = $('.original-price').first()
  
  if (discountPriceElement.length) {
    const priceText = discountPriceElement.text().replace(/[^\d.,]/g, '')
    product.discounted_price = parseFloat(priceText.replace(',', '.'))
  }
  
  if (originalPriceElement.length) {
    const originalText = originalPriceElement.text().replace(/[^\d.,]/g, '')
    product.original_price = parseFloat(originalText.replace(',', '.'))
  } else {
    product.original_price = product.discounted_price
  }

  // Fallback: procurar no texto
  if (!product.discounted_price) {
    const bodyText = $('body').text()
    const priceMatch = bodyText.match(/R?\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/)
    if (priceMatch) {
      product.discounted_price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'))
      product.original_price = product.discounted_price
    }
  }

  return product
}

// 🟦 GENÉRICO (fallback)
async function extractGeneric($: any, product: any) {
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
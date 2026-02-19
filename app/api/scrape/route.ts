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

// 🟦 SHOPEE - VERSÃO HIPER-OTIMIZADA PARA ENCONTRAR JSON
function extractShopee($: any, product: any, html: string) {
  console.log('🔍 Extraindo Shopee (modo JSON)...')

  // 1️⃣ TÍTULO: Tenta encontrar nos meta tags ou no HTML
  product.title = $('meta[property="og:title"]').attr('content') ||
                  $('meta[name="title"]').attr('content') ||
                  $('div[class*="product-title"]').text().trim() ||
                  $('h1').first().text().trim() ||
                  'Produto Shopee'

  // 2️⃣ IMAGEM: Tenta encontrar nos meta tags ou no HTML
  product.image = $('meta[property="og:image"]').attr('content') ||
                  $('meta[name="twitter:image"]').attr('content') ||
                  $('img[data-testid="image"]').attr('src') ||
                  $('img[class*="product-image"]').attr('src')

  // 3️⃣ PREÇOS: PROCURA POR DADOS JSON NO HTML (ESTRATÉGIA PRINCIPAL)
  console.log('🔍 Buscando blocos JSON no HTML...')

  // Padrões para encontrar blocos de dados da Shopee (geralmente em <script>)
  const jsonPatterns = [
    /window\.__initialData__\s*=\s*({.*?});/s,           // Dados iniciais
    /<script[^>]*>window\.__INITIAL_STATE__\s*=\s*({.*?});<\/script>/s, // Estado inicial
    /<script[^>]*id="__NEXT_DATA__"[^>]*>({.*?})<\/script>/s, // Dados do Next.js (se usarem)
    /"data"\s*:\s*({.*?})/s,                               // Objeto "data" genérico
    /"product"\s*:\s*({.*?})/s,                            // Objeto "product"
    /"item"\s*:\s*({.*?})/s,                               // Objeto "item"
    /"price"\s*:\s*(\d+)/g,                                // Preço numérico (global)
    /"price_min"\s*:\s*(\d+)/g,
    /"price_max"\s*:\s*(\d+)/g,
    /"original_price"\s*:\s*(\d+)/g,
    /"discounted_price"\s*:\s*(\d+)/g,
  ]

  let extractedPrices: { original: number | null, discounted: number | null } = {
    original: null,
    discounted: null
  }

  // Tenta cada padrão de expressão regular
  for (const pattern of jsonPatterns) {
    // Usa 's' (dotall) para que '.' capture quebras de linha
    const regex = new RegExp(pattern, 'gis')
    let match: RegExpExecArray | null

    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(html)) !== null) {
      try {
        // Se o padrão capturou um grupo, tenta fazer o parse
        if (match[1]) {
          // Tenta parsear como JSON, mas pode ser um trecho solto
          let jsonData = match[1]
          // Limpeza básica para tentar tornar o JSON válido (se necessário)
          // jsonData = jsonData.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Opcional: garante que as chaves tenham aspas
          
          // Tenta parsear o objeto JSON
          const data = JSON.parse(jsonData)
          
          // Função recursiva para procurar preços no objeto
          const findPrices = (obj: any) => {
            if (typeof obj === 'object' && obj !== null) {
              // Procura por campos comuns de preço
              if (obj.price && typeof obj.price === 'number') {
                extractedPrices.discounted = obj.price / 100000 // Ajuste de escala
              }
              if (obj.price_min && typeof obj.price_min === 'number') {
                extractedPrices.discounted = obj.price_min / 100000
              }
              if (obj.price_max && typeof obj.price_max === 'number') {
                extractedPrices.original = obj.price_max / 100000
              }
              if (obj.original_price && typeof obj.original_price === 'number') {
                extractedPrices.original = obj.original_price / 100000
              }
              if (obj.discounted_price && typeof obj.discounted_price === 'number') {
                extractedPrices.discounted = obj.discounted_price / 100000
              }
              
              // Se já encontrou ambos, para
              if (extractedPrices.original && extractedPrices.discounted) return
              
              // Recursão para objetos filhos
              for (const key in obj) {
                findPrices(obj[key])
              }
            } else if (Array.isArray(obj)) {
              obj.forEach(item => findPrices(item))
            }
          }
          
          findPrices(data)
          
          if (extractedPrices.discounted || extractedPrices.original) {
            console.log('💰 Preços encontrados via JSON parsing')
          }
        }
      } catch (e) {
        // Se o parse falhar, tenta extrair números diretamente do match
        console.log('⚠️ Falha no parse JSON, tentando extrair números do padrão...')
        const numberMatch = match[1].match(/(\d+)/)
        if (numberMatch) {
          const priceNum = parseInt(numberMatch[1]) / 100000
          if (pattern.toString().includes('original')) {
            extractedPrices.original = priceNum
          } else if (pattern.toString().includes('discounted')) {
            extractedPrices.discounted = priceNum
          } else if (!extractedPrices.discounted) {
            extractedPrices.discounted = priceNum
          } else if (!extractedPrices.original) {
            extractedPrices.original = priceNum
          }
          console.log(`💰 Preço numérico extraído do padrão: ${priceNum}`)
        }
      }
    }
  }

  // Se encontrou preços, atribui ao produto
  if (extractedPrices.discounted) {
    product.discounted_price = extractedPrices.discounted
    product.original_price = extractedPrices.original || extractedPrices.discounted
    console.log(`💰 Preço com desconto definido: ${product.discounted_price}`)
    if (extractedPrices.original) {
      console.log(`💰 Preço original definido: ${product.original_price}`)
    }
  }

  // 4️⃣ FALLBACK: Se não encontrou nos padrões, tenta no texto da página
  if (!product.discounted_price) {
    console.log('🔍 Tentando fallback no texto da página...')
    const bodyText = $('body').text()
    
    // Procura por "R$ 49,90" ou "R$49,90"
    const priceMatch = bodyText.match(/R?\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/)
    if (priceMatch) {
      const price = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'))
      product.discounted_price = price
      product.original_price = price
      console.log(`💰 Preço encontrado no fallback: ${price}`)
    }
  }

  // Log do resultado final
  console.log('✅ Resultado da extração Shopee:', {
    title: product.title,
    original_price: product.original_price,
    discounted_price: product.discounted_price,
    image: product.image ? 'encontrada' : 'não encontrada'
  })

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
import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, handleOptions } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  const res = handleOptions(request)
  return res ?? NextResponse.json({}, { status: 403 })
}

export async function GET(request: NextRequest) {
  const cors = corsHeaders(request)

  try {
    const country = request.headers.get('x-vercel-ip-country') || ''
    const region = request.headers.get('x-vercel-ip-region') || ''
    const city = request.headers.get('x-vercel-ip-city') || ''

    if (!country && process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          country: 'US',
          region: 'CA',
          city: 'San Francisco',
          source: 'development-fallback',
        },
        { headers: cors }
      )
    }

    return NextResponse.json(
      { country, region, city, source: 'vercel-headers' },
      { headers: cors }
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Geolocation API error:', error)
    }
    return NextResponse.json(
      { error: 'Failed to get geolocation data' },
      { status: 500, headers: cors }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const allowedOrigins = [
  siteUrl.replace(/\/$/, ''),
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false
  const o = origin.trim()
  if (/^https?:\/\/localhost(:\d+)?$/.test(o)) return true
  if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(o)) return true
  return allowedOrigins.some((a) => o === a)
}

export function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin')
  if (!isAllowedOrigin(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin!,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export function handleOptions(request: NextRequest): NextResponse | null {
  const h = corsHeaders(request)
  if (Object.keys(h).length === 0) return NextResponse.json({}, { status: 403 })
  return new NextResponse(null, { status: 204, headers: h })
}

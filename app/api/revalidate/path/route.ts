import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { getRevalidateTargets, type RevalidatePayload } from '@/lib/revalidate-targets'

export async function GET() {
  return NextResponse.json({
    message: 'Path revalidation endpoint. Use POST to revalidate.',
    endpoint: '/api/revalidate/path',
  })
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return new Response('Missing SANITY_REVALIDATE_SECRET', { status: 500 })
  }

  const { isValidSignature, body } = await parseBody<RevalidatePayload>(req, secret)

  if (!isValidSignature) {
    return new Response(JSON.stringify({ message: 'Invalid signature' }), { status: 401 })
  }

  if (!body?._type) {
    return new Response(JSON.stringify({ message: 'Missing _type' }), { status: 400 })
  }

  const targets = getRevalidateTargets(body)
  for (const { path, type } of targets) {
    revalidatePath(path, type)
  }

  return NextResponse.json({ body, targets })
}

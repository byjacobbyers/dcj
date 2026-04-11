import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = {
  _type: string
  _id?: string
  slug?: { current?: string }
}

function getPathForDocument(body: WebhookPayload): string[] {
  const paths: string[] = []
  const { _type, slug } = body

  switch (_type) {
    case 'page': {
      const pageSlug = slug?.current
      if (pageSlug === 'home') paths.push('/')
      else if (pageSlug) paths.push(`/${pageSlug}`)
      break
    }
    case 'event': {
      const eventSlug = slug?.current
      if (eventSlug) paths.push(`/events/${eventSlug}`)
      paths.push('/')
      break
    }
    case 'navigation':
    case 'site':
      paths.push('/')
      break
    default:
      paths.push('/')
  }

  return paths
}

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

  const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret)

  if (!isValidSignature) {
    return new Response(JSON.stringify({ message: 'Invalid signature' }), { status: 401 })
  }

  if (!body?._type) {
    return new Response(JSON.stringify({ message: 'Missing _type' }), { status: 400 })
  }

  const paths = getPathForDocument(body)
  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({ body, paths })
}

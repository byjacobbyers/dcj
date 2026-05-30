import { getSql } from '@/lib/neon'

type PaymentMethod = 'cash' | 'card' | 'none'

const paymentMethods = new Set<PaymentMethod>(['cash', 'card', 'none'])

function parseString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function isPaymentMethod(value: string): value is PaymentMethod {
  return paymentMethods.has(value as PaymentMethod)
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const firstName = parseString(body.firstName)
    const lastName = parseString(body.lastName)
    const email = parseString(body.email)
    const paymentMethod = parseString(body.paymentMethod)

    if (!firstName) {
      return Response.json({ error: 'First name is required' }, { status: 400 })
    }

    if (!lastName) {
      return Response.json({ error: 'Last name is required' }, { status: 400 })
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return Response.json({ error: 'A valid email is required' }, { status: 400 })
    }

    if (!isPaymentMethod(paymentMethod)) {
      return Response.json({ error: 'A valid payment method is required' }, { status: 400 })
    }

    const sql = getSql()
    const rows = (await sql`
      INSERT INTO signins (first_name, last_name, email, payment_method, signed_in_at)
      VALUES (${firstName}, ${lastName}, ${email}, ${paymentMethod}, NOW())
      RETURNING id, signed_in_at
    `) as Array<{ id: number; signed_in_at: string }>

    return Response.json({ success: true, signin: rows[0] })
  } catch (error) {
    console.error('[API Signin] Error:', error)
    return Response.json(
      { error: 'Internal server error', code: 'UNHANDLED' },
      { status: 500 }
    )
  }
}

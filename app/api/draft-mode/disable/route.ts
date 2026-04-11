import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const mode = await draftMode()
  mode.disable()
  const { origin } = request.nextUrl
  return NextResponse.redirect(origin + '/')
}

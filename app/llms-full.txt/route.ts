import { fetchLlmsFull, markdownResponse } from '@/lib/llms-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return markdownResponse(await fetchLlmsFull())
}

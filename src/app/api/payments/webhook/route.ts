import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null)
  console.info('[flouci-webhook]', payload?.payment_id ?? payload)
  return NextResponse.json({ received: true })
}

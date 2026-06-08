import { NextResponse } from 'next/server'
import { getAvailablePaymentProviders } from '@/lib/payments'

export async function GET() {
  const providers = getAvailablePaymentProviders()
  return NextResponse.json({
    flouci: providers.includes('flouci'),
    clictopay: providers.includes('clictopay'),
    providers,
  })
}

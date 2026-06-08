import { NextResponse } from 'next/server'
import { verifyTransferPayment } from '@/lib/payments'
import type { PaymentProvider } from '@/lib/payments/types'

function parseProvider(value: string | null): PaymentProvider | null {
  return value === 'flouci' || value === 'clictopay' ? value : null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const paymentId =
    searchParams.get('payment_id') ?? searchParams.get('payment_ref')
  const provider = parseProvider(searchParams.get('provider'))

  if (!paymentId) {
    return NextResponse.json({ error: 'Référence manquante', paid: false }, { status: 400 })
  }

  if (!provider) {
    return NextResponse.json(
      { error: 'Fournisseur de paiement manquant', paid: false },
      { status: 400 }
    )
  }

  const result = await verifyTransferPayment(provider, paymentId)

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message, paid: false, provider },
      { status: 502 }
    )
  }

  return NextResponse.json({
    paid: result.paid,
    status: result.paid ? 'SUCCESS' : result.status,
    paymentId,
    provider,
  })
}

import { NextResponse } from 'next/server'
import { initTransferPayment } from '@/lib/payments'
import type { PaymentProvider } from '@/lib/payments/types'
import { TRANSFER_FEE_MILLIMES } from '@/lib/transfer-payment'

const SETUP_STEPS = {
  flouci: [
    'Créer un compte marchand sur flouci.com',
    'Copier PUBLIC_KEY et PRIVATE_KEY (sandbox ou production)',
    'Ajouter FLOUCI_PUBLIC_KEY et FLOUCI_PRIVATE_KEY dans .env.local',
  ],
  clictopay: [
    'Signer un contrat ClicTo Pay avec votre banque (STB, BIAT, etc.)',
    'Récupérer userName et password marchand auprès de Monétique Tunisie',
    'Ajouter CLICTOPAY_USERNAME et CLICTOPAY_PASSWORD dans .env.local',
    'Optionnel : CLICTOPAY_SANDBOX=true (test) ou false (production)',
    'Optionnel : CLICTOPAY_API_BASE si votre banque fournit une URL personnalisée',
  ],
}

function parseProvider(value: unknown): PaymentProvider | null {
  return value === 'flouci' || value === 'clictopay' ? value : null
}

export async function POST(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const body = await request.json().catch(() => ({}))

  const provider = parseProvider(body.provider)
  if (!provider) {
    return NextResponse.json(
      { error: 'Moyen de paiement invalide. Choisissez flouci ou clictopay.' },
      { status: 400 }
    )
  }

  const trackingId =
    typeof body.orderId === 'string'
      ? body.orderId
      : `transfer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  const returnBase = `${siteUrl}/paiement/transfert/retour`

  const result = await initTransferPayment({
    provider,
    amountMillimes: TRANSFER_FEE_MILLIMES,
    trackingId,
    returnBaseUrl: returnBase,
    siteUrl,
  })

  if (!result.ok) {
    const setupRequired = result.message.toLowerCase().includes('non configuré')

    return NextResponse.json(
      {
        error: result.message,
        setupRequired,
        provider,
        steps: SETUP_STEPS[provider],
      },
      { status: setupRequired ? 503 : 502 }
    )
  }

  return NextResponse.json({
    payUrl: result.payUrl,
    paymentId: result.paymentId,
    provider: result.provider,
    trackingId,
  })
}

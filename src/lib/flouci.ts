import type { PaymentInitResult, PaymentVerifyResult } from '@/lib/payments/types'

const FLOUCI_API_BASE = 'https://developers.flouci.com/api/v2'

export function isFlouciConfigured(): boolean {
  return Boolean(
    process.env.FLOUCI_PUBLIC_KEY && process.env.FLOUCI_PRIVATE_KEY
  )
}

export function getFlouciAuthHeader(): string | null {
  const publicKey = process.env.FLOUCI_PUBLIC_KEY
  const privateKey = process.env.FLOUCI_PRIVATE_KEY
  if (!publicKey || !privateKey) return null
  return `Bearer ${publicKey}:${privateKey}`
}

type GeneratePaymentInput = {
  amountMillimes: number
  trackingId: string
  successLink: string
  failLink: string
  webhookUrl: string
  clientLabel?: string
}

export async function generateFlouciPayment(
  input: GeneratePaymentInput
): Promise<PaymentInitResult> {
  const auth = getFlouciAuthHeader()
  if (!auth) {
    return { ok: false, message: 'Flouci non configuré' }
  }

  const response = await fetch(`${FLOUCI_API_BASE}/generate_payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth,
    },
    body: JSON.stringify({
      amount: String(input.amountMillimes),
      developer_tracking_id: input.trackingId,
      accept_card: true,
      session_time_secs: 900,
      success_link: input.successLink,
      fail_link: input.failLink,
      webhook: input.webhookUrl,
      client_id: input.clientLabel ?? 'Just Hype — Transfert',
    }),
  })

  const data = await response.json().catch(() => null)
  const result = data?.result

  if (!response.ok || !result?.success || !result?.link || !result?.payment_id) {
    return {
      ok: false,
      message: result?.message ?? 'Impossible de créer le paiement Flouci',
    }
  }

  return {
    ok: true,
    paymentId: result.payment_id as string,
    payUrl: result.link as string,
    provider: 'flouci',
  }
}

export async function verifyFlouciPayment(
  paymentId: string
): Promise<PaymentVerifyResult> {
  const auth = getFlouciAuthHeader()
  if (!auth) {
    return { ok: false, message: 'Flouci non configuré' }
  }

  const response = await fetch(
    `${FLOUCI_API_BASE}/verify_payment/${encodeURIComponent(paymentId)}`,
    {
      headers: { Authorization: auth },
      cache: 'no-store',
    }
  )

  const data = await response.json().catch(() => null)

  if (!response.ok || data?.success !== true) {
    return {
      ok: false,
      message: data?.message ?? 'Vérification Flouci impossible',
    }
  }

  const status = data?.result?.status as string | undefined
  const paid = status === 'SUCCESS'

  return { ok: true, paid, status: status ?? 'UNKNOWN' }
}

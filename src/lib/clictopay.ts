import type { PaymentInitResult, PaymentVerifyResult } from '@/lib/payments/types'

const TND_CURRENCY_CODE = 788

export function isClicToPayConfigured(): boolean {
  return Boolean(
    process.env.CLICTOPAY_USERNAME && process.env.CLICTOPAY_PASSWORD
  )
}

export function getClicToPayApiBase(): string {
  const custom = process.env.CLICTOPAY_API_BASE?.replace(/\/$/, '')
  if (custom) return custom

  const sandbox = process.env.CLICTOPAY_SANDBOX !== 'false'
  return sandbox
    ? 'https://test.clictopay.com/payment/rest'
    : 'https://ipay.clictopay.com/payment/rest'
}

async function postForm(
  path: string,
  params: Record<string, string>
): Promise<Record<string, unknown>> {
  const username = process.env.CLICTOPAY_USERNAME
  const password = process.env.CLICTOPAY_PASSWORD
  if (!username || !password) {
    throw new Error('ClicTo Pay non configuré')
  }

  const body = new URLSearchParams({
    userName: username,
    password,
    ...params,
  })

  const response = await fetch(`${getClicToPayApiBase()}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  })

  return (await response.json().catch(() => ({}))) as Record<string, unknown>
}

function isClicToPayError(data: Record<string, unknown>): boolean {
  const code = data.errorCode ?? data.ErrorCode
  if (code === undefined || code === null) return false
  return String(code) !== '0'
}

type RegisterInput = {
  orderNumber: string
  amountMillimes: number
  returnUrl: string
  description?: string
}

export async function registerClicToPayPayment(
  input: RegisterInput
): Promise<PaymentInitResult> {
  if (!isClicToPayConfigured()) {
    return { ok: false, message: 'ClicTo Pay non configuré' }
  }

  const data = await postForm('register.do', {
    orderNumber: input.orderNumber,
    amount: String(input.amountMillimes),
    currency: String(TND_CURRENCY_CODE),
    returnUrl: input.returnUrl,
    language: 'fr',
    description: input.description ?? 'Just Hype — Frais transfert inter-boutique',
  })

  if (isClicToPayError(data)) {
    return {
      ok: false,
      message: String(data.errorMessage ?? data.ErrorMessage ?? 'Erreur ClicTo Pay'),
    }
  }

  const orderId = data.orderId as string | undefined
  const formUrl = data.formUrl as string | undefined

  if (!orderId || !formUrl) {
    return { ok: false, message: 'Réponse ClicTo Pay invalide' }
  }

  return { ok: true, paymentId: orderId, payUrl: formUrl, provider: 'clictopay' }
}

export async function verifyClicToPayPayment(
  orderId: string
): Promise<PaymentVerifyResult> {
  if (!isClicToPayConfigured()) {
    return { ok: false, message: 'ClicTo Pay non configuré' }
  }

  const data = await postForm('getOrderStatusExtended.do', {
    orderId,
    language: 'fr',
  })

  if (isClicToPayError(data)) {
    return {
      ok: false,
      message: String(data.errorMessage ?? data.ErrorMessage ?? 'Vérification impossible'),
    }
  }

  const orderStatus = Number(data.orderStatus ?? data.OrderStatus)
  const paid = orderStatus === 2

  return {
    ok: true,
    paid,
    status: paid ? 'SUCCESS' : String(orderStatus),
  }
}

import { isClicToPayConfigured, registerClicToPayPayment, verifyClicToPayPayment } from '@/lib/clictopay'
import { generateFlouciPayment, isFlouciConfigured, verifyFlouciPayment } from '@/lib/flouci'
import type { PaymentProvider, PaymentInitResult, PaymentVerifyResult } from '@/lib/payments/types'

export type { PaymentProvider } from '@/lib/payments/types'

export function getAvailablePaymentProviders(): PaymentProvider[] {
  const providers: PaymentProvider[] = []
  if (isFlouciConfigured()) providers.push('flouci')
  if (isClicToPayConfigured()) providers.push('clictopay')
  return providers
}

type InitTransferPaymentInput = {
  provider: PaymentProvider
  amountMillimes: number
  trackingId: string
  returnBaseUrl: string
  siteUrl: string
}

export async function initTransferPayment(
  input: InitTransferPaymentInput
): Promise<PaymentInitResult> {
  const successLink = `${input.returnBaseUrl}?status=success&provider=${input.provider}`
  const failLink = `${input.returnBaseUrl}?status=failed&provider=${input.provider}`

  if (input.provider === 'flouci') {
    if (!isFlouciConfigured()) {
      return { ok: false, message: 'Flouci non configuré' }
    }
    return generateFlouciPayment({
      amountMillimes: input.amountMillimes,
      trackingId: input.trackingId,
      successLink,
      failLink,
      webhookUrl: `${input.siteUrl}/api/payments/webhook`,
      clientLabel: 'Just Hype — Frais transfert inter-boutique',
    })
  }

  if (!isClicToPayConfigured()) {
    return { ok: false, message: 'ClicTo Pay non configuré' }
  }

  return registerClicToPayPayment({
    orderNumber: input.trackingId,
    amountMillimes: input.amountMillimes,
    returnUrl: successLink,
    description: 'Just Hype — Frais transfert inter-boutique (9 TND)',
  })
}

export async function verifyTransferPayment(
  provider: PaymentProvider,
  paymentId: string
): Promise<PaymentVerifyResult> {
  if (provider === 'clictopay') {
    return verifyClicToPayPayment(paymentId)
  }
  return verifyFlouciPayment(paymentId)
}

export const PAYMENT_PROVIDER_LABELS: Record<
  PaymentProvider,
  { name: string; hint: string }
> = {
  flouci: {
    name: 'Flouci',
    hint: 'Wallet, carte bancaire, e-Dinar — licencié BCT',
  },
  clictopay: {
    name: 'ClicTo Pay',
    hint: 'Carte CIB, Visa, Mastercard — Monétique Tunisie',
  },
}

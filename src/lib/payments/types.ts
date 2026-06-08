export type PaymentProvider = 'flouci' | 'clictopay'

export type PaymentInitResult =
  | { ok: true; paymentId: string; payUrl: string; provider: PaymentProvider }
  | { ok: false; message: string }

export type PaymentVerifyResult =
  | { ok: true; paid: true }
  | { ok: true; paid: false; status: string }
  | { ok: false; message: string }

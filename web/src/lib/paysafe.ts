declare global {
  interface Window {
    paysafe?: {
      checkout: {
        setup: (
          apiKey: string,
          options: Record<string, unknown>,
          resultCallback: (
            instance: unknown,
            error: { message?: string } | null,
            result?: { paymentHandleToken?: string },
          ) => void,
          closeCallback?: () => void,
        ) => void
      }
    }
  }
}

const CHECKOUT_SCRIPT =
  'https://hosted.paysafe.com/checkout/v2/paysafe.checkout.min.js'

let scriptPromise: Promise<void> | null = null

function loadPaysafeCheckoutScript() {
  if (window.paysafe?.checkout) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CHECKOUT_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () =>
        reject(new Error('Paysafe script failed to load')),
      )
      return
    }
    const script = document.createElement('script')
    script.src = CHECKOUT_SCRIPT
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Paysafe script failed to load'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

export type PaysafeCheckoutOptions = {
  publicKey: string
  amountMinor: number
  currency: string
  environment: 'TEST' | 'LIVE'
  merchantRefNum: string
  description?: string
}

/** Opens Paysafe Checkout and resolves with paymentHandleToken. */
export async function openPaysafeCheckout(
  options: PaysafeCheckoutOptions,
): Promise<string> {
  await loadPaysafeCheckoutScript()
  if (!window.paysafe?.checkout) {
    throw new Error('Paysafe Checkout unavailable')
  }

  return new Promise((resolve, reject) => {
    window.paysafe!.checkout.setup(
      options.publicKey,
      {
        amount: options.amountMinor,
        currency: options.currency,
        environment: options.environment,
        locale: 'en_US',
        merchantRefNum: options.merchantRefNum,
        description: options.description || options.merchantRefNum,
        displayPaymentMethods: ['card'],
      },
      (_instance, error, result) => {
        if (error) {
          reject(new Error(error.message || 'Paysafe checkout error'))
          return
        }
        const token = result?.paymentHandleToken
        if (!token) {
          reject(new Error('No payment handle returned'))
          return
        }
        resolve(token)
      },
      () => {
        reject(new Error('Checkout closed'))
      },
    )
  })
}

export function toMinorUnits(amount: number | string) {
  return Math.round(Number(amount) * 100)
}

import { useState } from 'react'
import type { CartItem, Page } from '../types'

interface CheckoutProps {
  cart: CartItem[]
  setCart: (items: CartItem[]) => void
  setPage: (p: Page) => void
}

type CheckoutStep = 'details' | 'processing' | 'success' | 'failed'

// Replace with your live Paystack public key
const PAYSTACK_PUBLIC_KEY = 'pk_test_c1f8a3c17db9030a81b5d489f8a50a77e2a804a5'

// Exchange rate placeholder — update to real rate or use a live API
const USD_TO_NGN = 1600

export default function Checkout({ cart, setCart, setPage }: CheckoutProps) {
  const [step, setStep] = useState<CheckoutStep>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [paymentRef, setPaymentRef] = useState('')
  const [formError, setFormError] = useState('')

  const subtotal = cart.reduce((sum, item) => sum + item.priceValue, 0)
  const total = subtotal

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!name.trim() || !email.trim()) {
      setFormError('Please fill in all fields to continue.')
      return
    }

    if (!window.PaystackPop) {
      setFormError('Payment service failed to load. Please refresh and try again.')
      return
    }

    const amountInKobo = Math.round(total * USD_TO_NGN * 100)

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email.trim(),
      amount: amountInKobo,
      currency: 'NGN',
      ref: `ink_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'name', value: name.trim() },
          { display_name: 'Items', variable_name: 'items', value: cart.map((c) => c.title).join(', ') },
        ],
      },
      callback: (response: { reference: string }) => {
        setPaymentRef(response.reference)
        setStep('success')
        setCart([])
      },
      onClose: () => {
        setStep('details')
      },
    })

    setStep('processing')
    handler.openIframe()
  }

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gold text-4xl mb-6">◈</p>
          <h2 className="font-serif text-navy text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-navy/55 mb-8">Add some products from the shop before checking out.</p>
          <button
            onClick={() => setPage('shop')}
            className="bg-navy text-cream text-sm font-semibold px-8 py-4 rounded-sm hover:bg-navy-mid transition-colors duration-200"
          >
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  /* ── SUCCESS SCREEN ── */
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-gold text-3xl">✓</span>
          </div>
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">Payment Confirmed</p>
          <h2 className="font-serif text-cream text-4xl font-bold mb-4">Thank You, {name || 'Friend'}!</h2>
          <p className="text-cream/60 leading-relaxed mb-6">
            Your order has been confirmed and your digital products will be delivered to{' '}
            <span className="text-cream">{email}</span> shortly.
          </p>
          {paymentRef && (
            <div className="bg-navy-light border border-white/10 px-6 py-4 mb-8 text-left">
              <p className="text-cream/40 text-xs font-semibold tracking-widest uppercase mb-1">Transaction Reference</p>
              <p className="text-cream font-mono text-sm break-all">{paymentRef}</p>
              <p className="text-cream/30 text-xs mt-2">Save this for your records.</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setPage('shop')}
              className="bg-gold text-navy text-sm font-semibold px-8 py-4 rounded-sm hover:bg-gold-light transition-colors duration-200"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => setPage('home')}
              className="border border-white/20 text-cream text-sm font-semibold px-8 py-4 rounded-sm hover:bg-white/5 transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── MAIN CHECKOUT ── */
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy px-6 lg:px-12 py-6 flex items-center justify-between">
        <button
          onClick={() => setPage('shop')}
          className="flex items-center gap-2 text-cream/60 hover:text-cream text-sm transition-colors duration-200"
        >
          ← Back to Shop
        </button>
        <p className="font-serif text-cream text-xl font-semibold">Checkout</p>
        <div className="flex items-center gap-2 text-cream/40 text-xs">
          <span className="text-gold">🔒</span>
          Secured by Paystack
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* ── LEFT: Order Details ── */}
          <div className="lg:col-span-3">
            <h1 className="font-serif text-navy text-3xl font-bold mb-8">Your Order</h1>

            {/* Cart items */}
            <div className="flex flex-col gap-4 mb-8">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-5 bg-white border border-navy/8 p-4"
                >
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy text-sm leading-snug">{item.title}</p>
                    <p className="text-navy/40 text-xs mt-0.5">{item.category}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-serif text-navy font-bold">{item.price}</span>
                    <button
                      onClick={() => setCart(cart.filter((c) => c.productId !== item.productId))}
                      className="text-navy/30 hover:text-red-400 text-xs transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-white border border-navy/8 p-6 mb-8">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm text-navy/60">
                  <span>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-navy/60">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free — Digital Download</span>
                </div>
                <div className="border-t border-navy/8 pt-3 flex justify-between">
                  <span className="font-semibold text-navy">Total</span>
                  <div className="text-right">
                    <p className="font-serif text-navy text-2xl font-bold">${total.toFixed(2)}</p>
                    <p className="text-navy/35 text-xs mt-0.5">
                      ≈ ₦{(total * USD_TO_NGN).toLocaleString()} NGN
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Currency & conversion note */}
            <div className="bg-gold/10 border border-gold/20 p-4 flex gap-3">
              <span className="text-gold text-lg flex-shrink-0">ℹ</span>
              <div>
                <p className="text-navy text-sm font-medium mb-0.5">Paystack processes in Nigerian Naira (NGN)</p>
                <p className="text-navy/55 text-xs leading-relaxed">
                  Your cart total of ${total.toFixed(2)} USD will be charged as approximately ₦{(total * USD_TO_NGN).toLocaleString()} NGN
                  at a rate of $1 = ₦{USD_TO_NGN}. The final rate is set at checkout.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Payment Form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-navy/8 p-8 sticky top-8">
              <h2 className="font-serif text-navy text-xl font-bold mb-6">Customer Details</h2>

              <form onSubmit={handlePay} className="flex flex-col gap-5">
                <div>
                  <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Chidi Okafor"
                    required
                    className="w-full border border-navy/15 text-navy text-sm px-4 py-3.5 bg-cream/40 rounded-sm placeholder-navy/25"
                  />
                </div>

                <div>
                  <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full border border-navy/15 text-navy text-sm px-4 py-3.5 bg-cream/40 rounded-sm placeholder-navy/25"
                  />
                  <p className="text-navy/35 text-xs mt-1.5">
                    Your download link will be sent here after payment.
                  </p>
                </div>

                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-sm">
                    {formError}
                  </div>
                )}

                {/* Paystack pay button */}
                <button
                  type="submit"
                  disabled={step === 'processing'}
                  className="bg-gold text-navy font-bold py-4 rounded-sm hover:bg-gold-light transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
                >
                  {step === 'processing' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                      Opening Payment...
                    </>
                  ) : (
                    <>
                      Pay ${total.toFixed(2)} via Paystack
                    </>
                  )}
                </button>

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-navy/35 text-xs">
                    <span>🔒</span> SSL Encrypted
                  </div>
                  <div className="w-px h-4 bg-navy/10" />
                  <div className="flex items-center gap-1.5 text-navy/35 text-xs">
                    <span>✓</span> Paystack Secured
                  </div>
                  <div className="w-px h-4 bg-navy/10" />
                  <div className="flex items-center gap-1.5 text-navy/35 text-xs">
                    <span>⚡</span> Instant Delivery
                  </div>
                </div>
              </form>

              {/* Accepted payment methods */}
              <div className="mt-6 pt-6 border-t border-navy/8">
                <p className="text-navy/35 text-xs text-center mb-3">Accepted payment methods</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {['Visa', 'Mastercard', 'Verve', 'Bank Transfer', 'USSD'].map((method) => (
                    <span
                      key={method}
                      className="text-xs font-medium text-navy/50 bg-navy/5 px-2.5 py-1 rounded"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="mt-4 bg-navy p-5 flex gap-3 items-start">
              <span className="text-gold text-xl flex-shrink-0">◉</span>
              <div>
                <p className="text-cream text-sm font-semibold mb-1">Instant Access Guaranteed</p>
                <p className="text-cream/50 text-xs leading-relaxed">
                  Digital products are delivered immediately after payment confirmation.
                  All sales are final for digital goods.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

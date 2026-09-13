import { useState } from 'react'
import { products as initialProducts } from '../data'
import type { CartItem, Page, Product } from '../types'

interface ShopProps {
  cart: CartItem[]
  setCart: (items: CartItem[]) => void
  setPage: (p: Page) => void
  liveProducts: Product[]
}

const categories = ['All', 'E-book', 'Creator Kit', 'Digital Planner', 'Prompt Pack', 'Story Collection']

export default function Shop({ cart, setCart, setPage, liveProducts }: ShopProps) {
  const [activeCategory, setActiveCategory] = useState('All')

  const allProducts = liveProducts.length > 0 ? liveProducts : initialProducts

  const filtered = activeCategory === 'All'
    ? allProducts
    : allProducts.filter((p) => p.category === activeCategory)

  const addToCart = (product: Product) => {
    if (cart.find((c) => c.productId === product.id)) return
    setCart([
      ...cart,
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        priceValue: product.priceValue,
        image: product.image,
        category: product.category,
      },
    ])
  }

  const inCart = (id: number) => !!cart.find((c) => c.productId === id)

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="bg-navy pt-40 pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(ellipse at 60% 50%, #C9A84C 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-5">Digital Products</p>
              <h1 className="font-serif text-cream text-5xl md:text-7xl font-bold mb-6">The Shop</h1>
              <p className="text-cream/60 text-lg max-w-xl leading-relaxed">
                Premium digital tools for storytellers and creators. Practical, beautiful, and built
                to move your creative work forward.
              </p>
            </div>

            {/* Cart summary */}
            {cart.length > 0 && (
              <div className="flex-shrink-0 bg-navy-light border border-white/10 p-5 w-56">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-cream text-sm font-semibold">Cart</p>
                  <span className="bg-gold text-navy text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                </div>
                <p className="text-cream/50 text-xs mb-4">
                  {cart.map((c) => c.title).join(', ').slice(0, 60)}
                  {cart.map((c) => c.title).join(', ').length > 60 ? '…' : ''}
                </p>
                <p className="text-gold font-serif text-xl font-bold mb-4">
                  ${cart.reduce((s, c) => s + c.priceValue, 0).toFixed(2)}
                </p>
                <button
                  onClick={() => setPage('checkout')}
                  className="w-full bg-gold text-navy text-xs font-bold py-3 rounded-sm hover:bg-gold-light transition-colors duration-200"
                >
                  Checkout →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky filter */}
      <section className="bg-navy-light border-b border-white/10 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <div className="flex gap-0 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                    activeCategory === cat
                      ? 'text-gold border-gold'
                      : 'text-cream/50 border-transparent hover:text-cream/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setPage('checkout')}
                className="hidden md:flex items-center gap-2 bg-gold text-navy text-xs font-bold px-4 py-2 rounded-sm hover:bg-gold-light transition-colors duration-200 mr-0 flex-shrink-0"
              >
                <span>Cart ({cart.length})</span>
                <span>→ Checkout</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-navy/40 text-2xl">No products in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white border border-navy/8 hover:border-navy/20 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative overflow-hidden aspect-square bg-cream-dark">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.badge && (
                      <span className="absolute top-4 left-4 bg-gold text-navy text-xs font-bold px-3 py-1 tracking-widest uppercase">
                        {p.badge}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <button
                        onClick={() => addToCart(p)}
                        disabled={inCart(p.id)}
                        className="w-full bg-gold text-navy text-sm font-bold py-3 rounded-sm hover:bg-gold-light disabled:opacity-70 transition-colors duration-200"
                      >
                        {inCart(p.id) ? '✓ Added to Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-gold text-xs font-bold tracking-widest uppercase mb-2 block">{p.category}</span>
                    <h3 className="font-serif text-navy text-xl font-semibold mb-2 leading-snug">{p.title}</h3>
                    <p className="text-navy/55 text-sm leading-relaxed mb-5">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-navy text-2xl font-bold">{p.price}</span>
                      <button
                        onClick={() => inCart(p.id) ? setPage('checkout') : addToCart(p)}
                        className={`text-xs font-bold px-4 py-2.5 rounded-sm tracking-wide uppercase transition-colors duration-200 ${
                          inCart(p.id)
                            ? 'bg-gold text-navy hover:bg-gold-light'
                            : 'bg-navy text-cream hover:bg-navy-mid'
                        }`}
                      >
                        {inCart(p.id) ? 'Go to Checkout' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating checkout bar when cart has items */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-navy border-t border-gold/30 px-6 py-4 flex items-center justify-between md:hidden">
          <div>
            <p className="text-cream text-sm font-semibold">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
            <p className="text-gold text-xs">${cart.reduce((s, c) => s + c.priceValue, 0).toFixed(2)} total</p>
          </div>
          <button
            onClick={() => setPage('checkout')}
            className="bg-gold text-navy text-sm font-bold px-6 py-3 rounded-sm hover:bg-gold-light transition-colors duration-200"
          >
            Checkout →
          </button>
        </div>
      )}

      {/* Trust bar */}
      <section className="bg-navy-light border-t border-white/10 py-12">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: '⚡', title: 'Instant Download', body: 'Your files are available immediately after payment.' },
              { icon: '🔒', title: 'Secure via Paystack', body: 'All transactions are encrypted and PCI-compliant.' },
              { icon: '◉', title: 'Lifetime Access', body: 'Once you buy, the resource is yours to keep forever.' },
            ].map((t) => (
              <div key={t.title}>
                <div className="text-2xl mb-3">{t.icon}</div>
                <p className="text-cream font-semibold text-sm mb-1">{t.title}</p>
                <p className="text-cream/50 text-xs">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

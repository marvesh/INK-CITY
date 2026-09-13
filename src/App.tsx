import { useState, useEffect } from 'react'
import type { Page, CartItem, Product } from './types'
import { products as seedProducts } from './data'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Stories from './pages/Stories'
import CreatorHub from './pages/CreatorHub'
import Resources from './pages/Resources'
import Shop from './pages/Shop'
import About from './pages/About'
import Admin from './pages/Admin'
import Checkout from './pages/Checkout'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [cart, setCart] = useState<CartItem[]>([])
  // liveProducts would be populated from Admin in a real backend;
  // for now we seed from data and let the shop always show the seed list.
  const [liveProducts] = useState<Product[]>(seedProducts)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const isAdmin = page === 'admin'
  const isCheckout = page === 'checkout'
  const hideChrome = isAdmin || isCheckout

  const renderPage = () => {
    switch (page) {
      case 'home':        return <Home setPage={setPage} />
      case 'stories':     return <Stories />
      case 'creator-hub': return <CreatorHub />
      case 'resources':   return <Resources />
      case 'shop':        return <Shop cart={cart} setCart={setCart} setPage={setPage} liveProducts={liveProducts} />
      case 'about':       return <About />
      case 'admin':       return <Admin />
      case 'checkout':    return <Checkout cart={cart} setCart={setCart} setPage={setPage} />
      default:            return <Home setPage={setPage} />
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      {!hideChrome && <Nav page={page} setPage={setPage} />}
      <main className="flex-1">{renderPage()}</main>
      {!hideChrome && <Footer setPage={setPage} />}
    </div>
  )
}

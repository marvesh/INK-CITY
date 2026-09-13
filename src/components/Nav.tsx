import { useState } from 'react'
import type { Page } from '../types'

interface NavProps {
  page: Page
  setPage: (p: Page) => void
}

const links: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'Stories', page: 'stories' },
  { label: 'Shop', page: 'shop' },
  { label: 'About', page: 'about' },
]

export default function Nav({ page, setPage }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useState(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  })

  const alwaysDark = page !== 'home'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen || alwaysDark
          ? 'bg-navy/97 backdrop-blur-sm shadow-lg shadow-navy/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => setPage('home')}
            className="font-serif text-cream text-xl font-semibold tracking-wide hover:text-gold-light transition-colors duration-200"
          >
            THE INK CITY
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.page}
                onClick={() => setPage(l.page)}
                className={`nav-link font-sans text-sm font-medium tracking-wide transition-colors duration-200 ${
                  page === l.page ? 'text-gold active' : 'text-cream/80 hover:text-cream'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage('shop')}
              className="hidden md:block bg-gold text-navy text-sm font-semibold px-5 py-2 rounded-sm hover:bg-gold-light transition-colors duration-200"
            >
              Shop
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-cream p-1"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-6">
                <span
                  className={`block h-px bg-cream transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`}
                />
                <span
                  className={`block h-px bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
                />
                <span
                  className={`block h-px bg-cream transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => { setPage(l.page); setMenuOpen(false) }}
              className={`text-left font-sans text-base font-medium transition-colors ${
                page === l.page ? 'text-gold' : 'text-cream/80'
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { setPage('shop'); setMenuOpen(false) }}
            className="mt-2 bg-gold text-navy text-sm font-semibold px-5 py-2.5 rounded-sm w-full text-center"
          >
            Visit Shop
          </button>
        </div>
      )}
    </nav>
  )
}

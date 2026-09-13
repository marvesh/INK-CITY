import type { Page } from '../types'

interface FooterProps {
  setPage: (p: Page) => void
}

export default function Footer({ setPage }: FooterProps) {
  return (
    <footer className="bg-navy text-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-serif text-2xl font-semibold mb-4 text-cream">THE INK CITY</p>
            <p className="text-cream/60 text-sm leading-relaxed mb-6">
              A digital storytelling and creator platform. Discover stories. Learn storytelling. Create your own.
            </p>
            <div className="flex gap-4">
              {['X', 'IG', 'YT', 'TK'].map((s) => (
                <span
                  key={s}
                  className="w-8 h-8 border border-cream/20 flex items-center justify-center text-xs text-cream/50 hover:border-gold hover:text-gold cursor-pointer transition-all duration-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-5">Navigate</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Home', page: 'home' as Page },
                { label: 'Stories', page: 'stories' as Page },
                { label: 'Shop', page: 'shop' as Page },
                { label: 'About', page: 'about' as Page },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => setPage(page)}
                    className="text-cream/60 hover:text-cream text-sm transition-colors duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / misc */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-5">More</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Admin', page: 'admin' as Page },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => setPage(page)}
                    className="text-cream/60 hover:text-cream text-sm transition-colors duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
              {['Privacy Policy', 'Terms of Use'].map((l) => (
                <li key={l}>
                  <button className="text-cream/60 hover:text-cream text-sm transition-colors duration-200">
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-5">The Ink Letter</p>
            <p className="text-cream/60 text-sm mb-4 leading-relaxed">
              Stories, creative tools, and creator insights — delivered weekly.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/5 border border-white/15 text-cream text-sm px-4 py-3 placeholder-cream/30 rounded-sm w-full"
              />
              <button className="bg-gold text-navy text-sm font-semibold px-4 py-3 rounded-sm hover:bg-gold-light transition-colors duration-200">
                Subscribe Free
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs">
            © 2024 The Ink City. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((l) => (
              <button key={l} className="text-cream/30 text-xs hover:text-cream/60 transition-colors duration-200">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

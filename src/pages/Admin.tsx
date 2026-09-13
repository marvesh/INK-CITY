import { useState } from 'react'
import { adminUsers, stories as initialStories, products as initialProducts } from '../data'
import type { AdminUser, Story, Product } from '../types'

type AdminTab = 'overview' | 'stories' | 'products' | 'users'

const ADMIN_EMAIL = 'admin@theinkbity.com'
const ADMIN_PASS = 'inkadmin2024'

const STORY_CATEGORIES = ['Adventure', 'Suspense', 'Romance', 'Drama', 'African-Inspired', 'Series']
const PRODUCT_CATEGORIES = ['E-book', 'Creator Kit', 'Digital Planner', 'Prompt Pack', 'Story Collection']
const PRODUCT_BADGES = ['', 'Bestseller', 'New', 'Featured']

/* ─── Blank form defaults ─── */
const blankStory = (): Omit<Story, 'id'> => ({
  category: STORY_CATEGORIES[0],
  title: '',
  description: '',
  readTime: '',
  image: '',
  featured: false,
})

const blankProduct = (): Omit<Product, 'id'> => ({
  title: '',
  description: '',
  price: '',
  priceValue: 0,
  category: PRODUCT_CATEGORIES[0],
  image: '',
  badge: '',
})

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  /* ─── Live content state ─── */
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [users, setUsers] = useState<AdminUser[]>(adminUsers)

  /* ─── Story form state ─── */
  const [showStoryForm, setShowStoryForm] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [storyForm, setStoryForm] = useState(blankStory())
  const [storyError, setStoryError] = useState('')

  /* ─── Product form state ─── */
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState(blankProduct())
  const [productError, setProductError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginEmail === ADMIN_EMAIL && loginPass === ADMIN_PASS) {
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials. Please try again.')
    }
  }

  /* ─── Story CRUD ─── */
  const openNewStory = () => {
    setEditingStory(null)
    setStoryForm(blankStory())
    setStoryError('')
    setShowStoryForm(true)
  }

  const openEditStory = (s: Story) => {
    setEditingStory(s)
    setStoryForm({ category: s.category, title: s.title, description: s.description, readTime: s.readTime, image: s.image, featured: s.featured ?? false })
    setStoryError('')
    setShowStoryForm(true)
  }

  const saveStory = () => {
    if (!storyForm.title.trim() || !storyForm.description.trim()) {
      setStoryError('Title and description are required.')
      return
    }
    if (editingStory) {
      setStories(stories.map((s) => s.id === editingStory.id ? { ...storyForm, id: editingStory.id } : s))
    } else {
      const newId = Math.max(0, ...stories.map((s) => s.id)) + 1
      setStories([...stories, { ...storyForm, id: newId }])
    }
    setShowStoryForm(false)
  }

  const deleteStory = (id: number) => {
    if (window.confirm('Delete this story?')) setStories(stories.filter((s) => s.id !== id))
  }

  /* ─── Product CRUD ─── */
  const openNewProduct = () => {
    setEditingProduct(null)
    setProductForm(blankProduct())
    setProductError('')
    setShowProductForm(true)
  }

  const openEditProduct = (p: Product) => {
    setEditingProduct(p)
    setProductForm({ title: p.title, description: p.description, price: p.price, priceValue: p.priceValue, category: p.category, image: p.image, badge: p.badge ?? '' })
    setProductError('')
    setShowProductForm(true)
  }

  const saveProduct = () => {
    if (!productForm.title.trim() || !productForm.price.trim()) {
      setProductError('Title and price are required.')
      return
    }
    const parsed = parseFloat(productForm.price.replace(/[^0-9.]/g, ''))
    const finalForm = { ...productForm, priceValue: isNaN(parsed) ? 0 : parsed, price: `$${isNaN(parsed) ? productForm.price : parsed}` }
    if (editingProduct) {
      setProducts(products.map((p) => p.id === editingProduct.id ? { ...finalForm, id: editingProduct.id } : p))
    } else {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1
      setProducts([...products, { ...finalForm, id: newId }])
    }
    setShowProductForm(false)
  }

  const deleteProduct = (id: number) => {
    if (window.confirm('Delete this product?')) setProducts(products.filter((p) => p.id !== id))
  }

  /* ─── User access ─── */
  const grantAccess = (id: number) => setUsers(users.map((u) => u.id === id ? { ...u, role: 'Editor' as const, status: 'Active' as const } : u))
  const revokeAccess = (id: number) => setUsers(users.map((u) => u.id === id && u.role !== 'Owner' ? { ...u, status: 'Revoked' as const } : u))
  const inviteUser = () => setUsers([...users, { id: users.length + 1, name: 'New Invitee', email: `invite${users.length + 1}@example.com`, role: 'Viewer', joined: 'Sep 2024', status: 'Pending' }])

  /* ──────────────────────── LOGIN ──────────────────────── */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="font-serif text-cream text-3xl font-bold mb-2">THE INK CITY</p>
            <p className="text-cream/40 text-sm tracking-widest uppercase">Admin Portal</p>
          </div>
          <div className="bg-navy-light border border-white/10 p-10">
            <h2 className="font-serif text-cream text-2xl font-semibold mb-8">Sign In</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Email</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="admin@theinkbity.com" required
                  className="w-full bg-navy border border-white/15 text-cream text-sm px-4 py-3.5 placeholder-cream/25 rounded-sm" />
              </div>
              <div>
                <label className="text-cream/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Password</label>
                <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••••" required
                  className="w-full bg-navy border border-white/15 text-cream text-sm px-4 py-3.5 placeholder-cream/25 rounded-sm" />
              </div>
              {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
              <button type="submit" className="bg-gold text-navy text-sm font-bold py-4 rounded-sm hover:bg-gold-light transition-colors duration-200 mt-2">
                Sign In to Admin
              </button>
            </form>
            <p className="text-cream/20 text-xs text-center mt-6">Demo: admin@theinkbity.com / inkadmin2024</p>
          </div>
        </div>
      </div>
    )
  }

  const navItems: { id: AdminTab; label: string; icon: string; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: '◉' },
    { id: 'stories', label: 'Stories', icon: '✏', count: stories.length },
    { id: 'products', label: 'Products', icon: '◈', count: products.length },
    { id: 'users', label: 'User Access', icon: '▶', count: users.length },
  ]

  /* ──────────────────────── DASHBOARD ──────────────────────── */
  return (
    <div className="min-h-screen bg-cream-dark flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-8 border-b border-white/10">
          <p className="font-serif text-cream text-xl font-bold">THE INK CITY</p>
          <p className="text-cream/40 text-xs tracking-widest uppercase mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
              className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-sm transition-all duration-200 text-left ${activeTab === item.id ? 'bg-gold/15 text-gold border-l-2 border-gold' : 'text-cream/55 hover:text-cream hover:bg-white/5'}`}>
              <div className="flex items-center gap-3">
                <span className={`text-base ${activeTab === item.id ? 'text-gold' : 'text-cream/30'}`}>{item.icon}</span>
                {item.label}
              </div>
              {item.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === item.id ? 'bg-gold/20 text-gold' : 'bg-white/10 text-cream/40'}`}>{item.count}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-4 py-6 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 mb-4">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
              <span className="text-gold text-xs font-bold">CO</span>
            </div>
            <div>
              <p className="text-cream text-xs font-semibold">Chidi Okafor</p>
              <p className="text-cream/40 text-xs">Owner</p>
            </div>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="w-full text-left px-4 py-2.5 text-cream/40 hover:text-cream text-xs transition-colors">Sign Out</button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-navy/8 px-6 lg:px-10 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-navy/60 text-xl p-1">☰</button>
            <h1 className="font-semibold text-navy">{navItems.find((n) => n.id === activeTab)?.label}</h1>
          </div>
          <span className="bg-gold/15 text-gold text-xs font-bold px-3 py-1.5 rounded-sm">Owner</span>
        </header>

        <main className="flex-1 px-6 lg:px-10 py-8 overflow-auto">

          {/* ═══════════════ OVERVIEW ═══════════════ */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {[
                  { label: 'Total Stories', value: stories.length.toString(), sub: `${stories.filter(s => s.featured).length} featured`, icon: '✏' },
                  { label: 'Products Listed', value: products.length.toString(), sub: `${products.filter(p => p.badge).length} with badges`, icon: '◈' },
                  { label: 'Active Users', value: '12,840', sub: '+340 this month', icon: '◉' },
                  { label: 'Revenue (Est.)', value: '$4,210', sub: 'This month', icon: '✦' },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-navy/8 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-navy/50 text-xs font-semibold tracking-wide uppercase">{s.label}</p>
                      <span className="text-gold/60 text-lg">{s.icon}</span>
                    </div>
                    <p className="font-serif text-navy text-3xl font-bold mb-1">{s.value}</p>
                    <p className="text-navy/40 text-xs">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-navy/8 p-6">
                  <h2 className="font-serif text-navy text-lg font-semibold mb-5">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'New Story', icon: '✏', action: () => { setActiveTab('stories'); setTimeout(openNewStory, 100) } },
                      { label: 'New Product', icon: '◈', action: () => { setActiveTab('products'); setTimeout(openNewProduct, 100) } },
                      { label: 'Invite User', icon: '▶', action: () => setActiveTab('users') },
                      { label: 'View Stories', icon: '◉', action: () => setActiveTab('stories') },
                    ].map((qa) => (
                      <button key={qa.label} onClick={qa.action}
                        className="flex items-center gap-3 p-4 border border-navy/8 hover:border-gold/30 hover:bg-gold/5 transition-all duration-200 text-left">
                        <span className="text-gold text-lg">{qa.icon}</span>
                        <span className="text-navy text-sm font-medium">{qa.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-navy/8 p-6">
                  <h2 className="font-serif text-navy text-lg font-semibold mb-5">Recent Stories</h2>
                  <div className="flex flex-col gap-3">
                    {stories.slice(0, 4).map((s) => (
                      <div key={s.id} className="flex items-center gap-3 py-2 border-b border-navy/5 last:border-0">
                        <div className="w-8 h-8 rounded-sm overflow-hidden bg-cream-dark flex-shrink-0">
                          <img src={s.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-navy text-sm font-medium truncate">{s.title}</p>
                          <p className="text-navy/40 text-xs">{s.category}</p>
                        </div>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Published</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ STORIES ═══════════════ */}
          {activeTab === 'stories' && (
            <div>
              {/* Create / Edit form */}
              {showStoryForm && (
                <div className="bg-white border border-navy/15 p-8 mb-8 relative">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-navy text-xl font-bold">{editingStory ? 'Edit Story' : 'Create New Story'}</h2>
                    <button onClick={() => setShowStoryForm(false)} className="text-navy/40 hover:text-navy text-2xl leading-none">×</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Title *</label>
                      <input value={storyForm.title} onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                        placeholder="Story title" className="w-full border border-navy/15 text-navy text-sm px-4 py-3 bg-cream/40 rounded-sm" />
                    </div>
                    <div>
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Category</label>
                      <select value={storyForm.category} onChange={(e) => setStoryForm({ ...storyForm, category: e.target.value })}
                        className="w-full border border-navy/15 text-navy text-sm px-4 py-3 bg-cream/40 rounded-sm">
                        {STORY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Read Time</label>
                      <input value={storyForm.readTime} onChange={(e) => setStoryForm({ ...storyForm, readTime: e.target.value })}
                        placeholder="e.g. 12 min read" className="w-full border border-navy/15 text-navy text-sm px-4 py-3 bg-cream/40 rounded-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Description *</label>
                      <textarea value={storyForm.description} onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                        placeholder="Short description (1–2 sentences)" rows={3}
                        className="w-full border border-navy/15 text-navy text-sm px-4 py-3 bg-cream/40 rounded-sm resize-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Cover Image URL</label>
                      <input value={storyForm.image} onChange={(e) => setStoryForm({ ...storyForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..." className="w-full border border-navy/15 text-navy text-sm px-4 py-3 bg-cream/40 rounded-sm" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <input type="checkbox" id="featured" checked={storyForm.featured} onChange={(e) => setStoryForm({ ...storyForm, featured: e.target.checked })}
                        className="w-4 h-4 accent-gold" />
                      <label htmlFor="featured" className="text-navy/70 text-sm cursor-pointer">Mark as Featured (shown on homepage)</label>
                    </div>
                  </div>
                  {storyError && <p className="text-red-500 text-sm mt-4">{storyError}</p>}
                  <div className="flex gap-3 mt-6">
                    <button onClick={saveStory} className="bg-gold text-navy text-sm font-bold px-6 py-3 rounded-sm hover:bg-gold-light transition-colors">
                      {editingStory ? 'Save Changes' : 'Publish Story'}
                    </button>
                    <button onClick={() => setShowStoryForm(false)} className="border border-navy/15 text-navy text-sm font-medium px-6 py-3 rounded-sm hover:bg-navy/5 transition-colors">
                      Cancel
                    </button>
                  </div>

                  {/* Preview */}
                  {storyForm.image && (
                    <div className="mt-6 pt-6 border-t border-navy/8">
                      <p className="text-navy/40 text-xs font-semibold tracking-widest uppercase mb-3">Card Preview</p>
                      <div className="flex gap-5 items-start max-w-sm">
                        <div className="w-20 h-28 rounded-sm overflow-hidden bg-cream-dark flex-shrink-0">
                          <img src={storyForm.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="text-gold text-xs font-bold uppercase tracking-widest">{storyForm.category}</span>
                          <p className="font-serif text-navy text-base font-semibold mt-1 leading-snug">{storyForm.title || 'Story Title'}</p>
                          <p className="text-navy/50 text-xs mt-1">{storyForm.readTime}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mb-5">
                <p className="text-navy/50 text-sm">{stories.length} stories published</p>
                {!showStoryForm && (
                  <button onClick={openNewStory} className="bg-gold text-navy text-xs font-bold px-5 py-2.5 rounded-sm hover:bg-gold-light transition-colors">
                    + New Story
                  </button>
                )}
              </div>

              <div className="bg-white border border-navy/8 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy/8">
                      <th className="text-left px-6 py-4 text-navy/40 text-xs font-semibold tracking-widest uppercase">Story</th>
                      <th className="text-left px-6 py-4 text-navy/40 text-xs font-semibold tracking-widest uppercase hidden sm:table-cell">Category</th>
                      <th className="text-left px-6 py-4 text-navy/40 text-xs font-semibold tracking-widest uppercase hidden md:table-cell">Featured</th>
                      <th className="text-left px-6 py-4 text-navy/40 text-xs font-semibold tracking-widest uppercase hidden md:table-cell">Read Time</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map((s) => (
                      <tr key={s.id} className="border-b border-navy/5 hover:bg-cream-dark/40 transition-colors last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 rounded-sm overflow-hidden bg-cream-dark flex-shrink-0">
                              {s.image ? <img src={s.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-navy/10" />}
                            </div>
                            <p className="font-medium text-navy text-sm leading-snug max-w-[160px]">{s.title}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="bg-gold/10 text-gold text-xs font-bold px-2.5 py-1">{s.category}</span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {s.featured
                            ? <span className="text-xs text-green-600 font-semibold">✓ Featured</span>
                            : <span className="text-xs text-navy/30">—</span>}
                        </td>
                        <td className="px-6 py-4 text-navy/50 text-sm hidden md:table-cell">{s.readTime}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 justify-end">
                            <button onClick={() => openEditStory(s)} className="text-navy/50 hover:text-gold text-xs font-semibold transition-colors">Edit</button>
                            <button onClick={() => deleteStory(s.id)} className="text-red-400/60 hover:text-red-500 text-xs transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {stories.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-16 text-center text-navy/30 text-sm">No stories yet. Create your first one above.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════ PRODUCTS ═══════════════ */}
          {activeTab === 'products' && (
            <div>
              {/* Create / Edit form */}
              {showProductForm && (
                <div className="bg-white border border-navy/15 p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-navy text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={() => setShowProductForm(false)} className="text-navy/40 hover:text-navy text-2xl leading-none">×</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Product Title *</label>
                      <input value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        placeholder="e.g. The Story Bible: Complete Edition"
                        className="w-full border border-navy/15 text-navy text-sm px-4 py-3 bg-cream/40 rounded-sm" />
                    </div>
                    <div>
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Category</label>
                      <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full border border-navy/15 text-navy text-sm px-4 py-3 bg-cream/40 rounded-sm">
                        {PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Price (USD) *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 text-sm">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={productForm.priceValue || ''}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value)
                            setProductForm({ ...productForm, priceValue: isNaN(v) ? 0 : v, price: `$${isNaN(v) ? '' : v}` })
                          }}
                          placeholder="19.00"
                          className="w-full border border-navy/15 text-navy text-sm pl-8 pr-4 py-3 bg-cream/40 rounded-sm"
                        />
                      </div>
                      {productForm.priceValue > 0 && (
                        <p className="text-navy/40 text-xs mt-1">≈ ₦{(productForm.priceValue * 1600).toLocaleString()} NGN</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Description</label>
                      <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Short description of what the product includes..." rows={3}
                        className="w-full border border-navy/15 text-navy text-sm px-4 py-3 bg-cream/40 rounded-sm resize-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Product Image URL</label>
                      <input value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full border border-navy/15 text-navy text-sm px-4 py-3 bg-cream/40 rounded-sm" />
                    </div>
                    <div>
                      <label className="text-navy/50 text-xs font-semibold tracking-widest uppercase mb-2 block">Badge (optional)</label>
                      <select value={productForm.badge ?? ''} onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                        className="w-full border border-navy/15 text-navy text-sm px-4 py-3 bg-cream/40 rounded-sm">
                        {PRODUCT_BADGES.map((b) => <option key={b} value={b}>{b || 'No badge'}</option>)}
                      </select>
                    </div>
                    <div className="flex items-end pb-1">
                      {productForm.image && (
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-sm overflow-hidden bg-cream-dark">
                            <img src={productForm.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-navy/40 text-xs uppercase tracking-wide mb-0.5">Preview</p>
                            <p className="text-navy font-semibold text-sm">{productForm.title || 'Product name'}</p>
                            <p className="text-gold font-bold">{productForm.price || '$0'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {productError && <p className="text-red-500 text-sm mt-4">{productError}</p>}
                  <div className="flex gap-3 mt-6">
                    <button onClick={saveProduct} className="bg-gold text-navy text-sm font-bold px-6 py-3 rounded-sm hover:bg-gold-light transition-colors">
                      {editingProduct ? 'Save Changes' : 'Add Product'}
                    </button>
                    <button onClick={() => setShowProductForm(false)} className="border border-navy/15 text-navy text-sm font-medium px-6 py-3 rounded-sm hover:bg-navy/5 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-5">
                <p className="text-navy/50 text-sm">{products.length} products in shop</p>
                {!showProductForm && (
                  <button onClick={openNewProduct} className="bg-gold text-navy text-xs font-bold px-5 py-2.5 rounded-sm hover:bg-gold-light transition-colors">
                    + Add Product
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => (
                  <div key={p.id} className="bg-white border border-navy/8 overflow-hidden group">
                    <div className="aspect-video overflow-hidden bg-cream-dark relative">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-navy/20 text-4xl">◈</div>
                      )}
                      {p.badge && (
                        <span className="absolute top-2 left-2 bg-gold text-navy text-xs font-bold px-2 py-0.5 tracking-wide">{p.badge}</span>
                      )}
                      <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                        <button onClick={() => openEditProduct(p)} className="bg-gold text-navy text-xs font-bold px-3 py-2 rounded-sm hover:bg-gold-light">Edit</button>
                        <button onClick={() => deleteProduct(p.id)} className="bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-sm hover:bg-red-600">Delete</button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gold text-xs font-bold tracking-wide uppercase">{p.category}</span>
                        <span className="font-serif text-navy font-bold text-lg">{p.price}</span>
                      </div>
                      <p className="font-medium text-navy text-sm leading-snug">{p.title}</p>
                      {p.priceValue > 0 && (
                        <p className="text-navy/35 text-xs mt-1">≈ ₦{(p.priceValue * 1600).toLocaleString()} NGN</p>
                      )}
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="col-span-3 py-16 text-center text-navy/30 text-sm bg-white border border-navy/8">No products yet. Add your first one above.</div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════ USERS ═══════════════ */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-navy/50 text-sm">{users.length} team members</p>
                  <p className="text-navy/30 text-xs mt-0.5">Grant or revoke editing access to collaborators</p>
                </div>
                <button onClick={inviteUser} className="bg-gold text-navy text-xs font-bold px-5 py-2.5 rounded-sm hover:bg-gold-light transition-colors">
                  + Invite User
                </button>
              </div>

              <div className="bg-white border border-navy/8 overflow-hidden mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-navy/8">
                      <th className="text-left px-6 py-4 text-navy/40 text-xs font-semibold tracking-widest uppercase">User</th>
                      <th className="text-left px-6 py-4 text-navy/40 text-xs font-semibold tracking-widest uppercase hidden sm:table-cell">Role</th>
                      <th className="text-left px-6 py-4 text-navy/40 text-xs font-semibold tracking-widests uppercase hidden md:table-cell">Status</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-navy/5 last:border-0 hover:bg-cream-dark/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-gold text-xs font-bold">{u.name.split(' ').map((n) => n[0]).join('')}</span>
                            </div>
                            <div>
                              <p className="font-medium text-navy text-sm">{u.name}</p>
                              <p className="text-navy/40 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-sm ${u.role === 'Owner' ? 'bg-gold/20 text-gold-muted' : u.role === 'Editor' ? 'bg-blue-50 text-blue-700' : 'bg-navy/5 text-navy/50'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.status === 'Active' ? 'bg-green-50 text-green-700' : u.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-600'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 justify-end">
                            {u.role !== 'Owner' && (
                              <>
                                {(u.status !== 'Active' || u.role === 'Viewer') && (
                                  <button onClick={() => grantAccess(u.id)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">Grant Editor</button>
                                )}
                                {u.status === 'Active' && (
                                  <button onClick={() => revokeAccess(u.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">Revoke</button>
                                )}
                              </>
                            )}
                            {u.role === 'Owner' && <span className="text-navy/30 text-xs">—</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-navy p-6">
                <h3 className="font-serif text-cream text-base font-semibold mb-4">Access Levels</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { role: 'Owner', desc: 'Full control — manage all content, users, and access. Cannot be revoked.', color: 'text-gold' },
                    { role: 'Editor', desc: 'Can create, edit, and publish stories and products. Cannot manage users.', color: 'text-blue-300' },
                    { role: 'Viewer', desc: 'Read-only access to the dashboard. No editing rights.', color: 'text-cream/50' },
                  ].map((a) => (
                    <div key={a.role} className="border border-white/10 p-4">
                      <p className={`font-semibold text-sm mb-1 ${a.color}`}>{a.role}</p>
                      <p className="text-cream/50 text-xs leading-relaxed">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

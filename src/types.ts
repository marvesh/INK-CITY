export type Page = 'home' | 'stories' | 'shop' | 'about' | 'admin' | 'checkout'

export interface Story {
  id: number
  category: string
  title: string
  description: string
  readTime: string
  image: string
  featured?: boolean
}

export interface Product {
  id: number
  title: string
  description: string
  price: string
  priceValue: number
  category: string
  image: string
  badge?: string
}

export interface CartItem {
  productId: number
  title: string
  price: string
  priceValue: number
  image: string
  category: string
}

export interface Resource {
  id: number
  title: string
  description: string
  format: string
  icon: string
}

export interface AdminUser {
  id: number
  name: string
  email: string
  role: 'Owner' | 'Editor' | 'Viewer'
  joined: string
  status: 'Active' | 'Pending' | 'Revoked'
}

export interface PaystackConfig {
  key: string
  email: string
  amount: number
  currency: string
  ref: string
  metadata?: Record<string, unknown>
  callback: (response: { reference: string }) => void
  onClose: () => void
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void }
    }
  }
}

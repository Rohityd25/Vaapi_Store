import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartVariant {
  id: string
  sku: string
  size: string
  color: string
  colorHex?: string
  price: number
  stock: number
}

export interface CartProduct {
  id: string
  title: string
  slug: string
  imageUrl?: string
}

export interface CartItem {
  id: string // variantId
  variant: CartVariant
  product: CartProduct
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  couponCode: string
  couponDiscount: number

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void

  // Computed
  itemCount: () => number
  subtotal: () => number
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: '',
      couponDiscount: 0,

      addItem: (newItem, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, i.variant.stock) }
                  : i
              ),
              isOpen: true,
            }
          }
          return {
            items: [...state.items, { ...newItem, quantity }],
            isOpen: true,
          }
        })
      },

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== variantId),
        })),

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === variantId
              ? { ...i, quantity: Math.min(quantity, i.variant.stock) }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [], couponCode: '', couponDiscount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      removeCoupon: () => set({ couponCode: '', couponDiscount: 0 }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0),
      total: () => {
        const subtotal = get().subtotal()
        const discount = get().couponDiscount
        return Math.max(0, subtotal - discount)
      },
    }),
    {
      name: 'vaapi-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

import { create } from 'zustand'

interface UIState {
  // Mobile menu
  mobileMenuOpen: boolean
  openMobileMenu: () => void
  closeMobileMenu: () => void

  // Search
  searchOpen: boolean
  searchQuery: string
  openSearch: () => void
  closeSearch: () => void
  setSearchQuery: (q: string) => void

  // Toast/notification
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void

  // Loading overlay
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export const useUIStore = create<UIState>((set, get) => ({
  mobileMenuOpen: false,
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),

  searchOpen: false,
  searchQuery: '',
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false, searchQuery: '' }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2)
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    setTimeout(() => {
      get().removeToast(id)
    }, toast.duration ?? 4000)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}))

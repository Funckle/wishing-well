import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Well, Wish } from '@/types/database'

interface User {
  id: string
  email?: string
  profile?: Profile
}

interface AppState {
  // Auth
  user: User | null
  setUser: (user: User | null) => void

  // Wells
  myWells: Well[]
  setMyWells: (wells: Well[]) => void
  addWell: (well: Well) => void
  updateWell: (wellId: string, updates: Partial<Well>) => void

  // Current well viewing
  currentWell: Well | null
  currentWishes: Wish[]
  setCurrentWell: (well: Well | null) => void
  setCurrentWishes: (wishes: Wish[]) => void
  updateWish: (wishId: string, updates: Partial<Wish>) => void

  // UI State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),

      // Wells
      myWells: [],
      setMyWells: (wells) => set({ myWells: wells }),
      addWell: (well) => set((state) => ({ myWells: [well, ...state.myWells] })),
      updateWell: (wellId, updates) =>
        set((state) => ({
          myWells: state.myWells.map((w) =>
            w.id === wellId ? { ...w, ...updates } : w
          ),
        })),

      // Current well viewing
      currentWell: null,
      currentWishes: [],
      setCurrentWell: (well) => set({ currentWell: well }),
      setCurrentWishes: (wishes) => set({ currentWishes: wishes }),
      updateWish: (wishId, updates) =>
        set((state) => ({
          currentWishes: state.currentWishes.map((w) =>
            w.id === wishId ? { ...w, ...updates } : w
          ),
        })),

      // UI State
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'wishing-well-storage',
      partialize: (state) => ({
        // Only persist certain fields
        user: state.user,
      }),
    }
  )
)

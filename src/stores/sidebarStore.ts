import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SidebarMode = 'list' | 'grid'

interface SidebarState {
  mode: SidebarMode
  setMode: (mode: SidebarMode) => void
  toggleMode: () => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      mode: 'list',
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'list' ? 'grid' : 'list' })),
    }),
    {
      name: 'devtools-sidebar-mode',
    }
  )
)

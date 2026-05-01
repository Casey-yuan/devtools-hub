import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UsageState {
  clicks: Record<string, number>
  incrementClick: (path: string) => void
  getTopTools: (limit?: number) => string[]
  getTotalClicks: () => number
}

export const useUsageStore = create<UsageState>()(
  persist(
    (set, get) => ({
      clicks: {},
      incrementClick: (path) => {
        set((state) => ({
          clicks: {
            ...state.clicks,
            [path]: (state.clicks[path] || 0) + 1,
          },
        }))
      },
      getTopTools: (limit = 6) => {
        const { clicks } = get()
        return Object.entries(clicks)
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([path]) => path)
      },
      getTotalClicks: () => {
        const { clicks } = get()
        return Object.values(clicks).reduce((sum, count) => sum + count, 0)
      },
    }),
    {
      name: 'devtools-usage',
    }
  )
)

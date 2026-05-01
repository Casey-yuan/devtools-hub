import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'green'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const themeColors: Record<Theme, Record<string, string>> = {
  light: {
    '--background': '0 0% 100%',
    '--foreground': '222.2 84% 4.9%',
    '--card': '0 0% 100%',
    '--card-foreground': '222.2 84% 4.9%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '222.2 84% 4.9%',
    '--primary': '221.2 83.2% 53.3%',
    '--primary-foreground': '210 40% 98%',
    '--secondary': '210 40% 96.1%',
    '--secondary-foreground': '222.2 47.4% 11.2%',
    '--muted': '210 40% 96.1%',
    '--muted-foreground': '215.4 16.3% 46.9%',
    '--accent': '210 40% 96.1%',
    '--accent-foreground': '222.2 47.4% 11.2%',
    '--destructive': '0 84.2% 60.2%',
    '--destructive-foreground': '210 40% 98%',
    '--border': '214.3 31.8% 91.4%',
    '--input': '214.3 31.8% 91.4%',
    '--ring': '221.2 83.2% 53.3%',
    '--radius': '0.5rem',
  },
  dark: {
    '--background': '222.2 84% 4.9%',
    '--foreground': '210 40% 98%',
    '--card': '222.2 84% 4.9%',
    '--card-foreground': '210 40% 98%',
    '--popover': '222.2 84% 4.9%',
    '--popover-foreground': '210 40% 98%',
    '--primary': '217.2 91.2% 59.8%',
    '--primary-foreground': '222.2 47.4% 11.2%',
    '--secondary': '217.2 32.6% 17.5%',
    '--secondary-foreground': '210 40% 98%',
    '--muted': '217.2 32.6% 17.5%',
    '--muted-foreground': '215 20.2% 65.1%',
    '--accent': '217.2 32.6% 17.5%',
    '--accent-foreground': '210 40% 98%',
    '--destructive': '0 62.8% 30.6%',
    '--destructive-foreground': '210 40% 98%',
    '--border': '217.2 32.6% 17.5%',
    '--input': '217.2 32.6% 17.5%',
    '--ring': '224.3 76.3% 48%',
    '--radius': '0.5rem',
  },
  blue: {
    '--background': '217 50% 8%',
    '--foreground': '210 40% 98%',
    '--card': '217 50% 10%',
    '--card-foreground': '210 40% 98%',
    '--popover': '217 50% 10%',
    '--popover-foreground': '210 40% 98%',
    '--primary': '199 89% 48%',
    '--primary-foreground': '210 40% 98%',
    '--secondary': '217 40% 18%',
    '--secondary-foreground': '210 40% 98%',
    '--muted': '217 40% 18%',
    '--muted-foreground': '215 20.2% 65.1%',
    '--accent': '217 40% 18%',
    '--accent-foreground': '210 40% 98%',
    '--destructive': '0 62.8% 30.6%',
    '--destructive-foreground': '210 40% 98%',
    '--border': '217 40% 20%',
    '--input': '217 40% 20%',
    '--ring': '199 89% 48%',
    '--radius': '0.5rem',
  },
  purple: {
    '--background': '270 50% 8%',
    '--foreground': '270 40% 98%',
    '--card': '270 50% 10%',
    '--card-foreground': '270 40% 98%',
    '--popover': '270 50% 10%',
    '--popover-foreground': '270 40% 98%',
    '--primary': '270 70% 60%',
    '--primary-foreground': '270 40% 98%',
    '--secondary': '270 40% 18%',
    '--secondary-foreground': '270 40% 98%',
    '--muted': '270 40% 18%',
    '--muted-foreground': '270 20.2% 65.1%',
    '--accent': '270 40% 18%',
    '--accent-foreground': '270 40% 98%',
    '--destructive': '0 62.8% 30.6%',
    '--destructive-foreground': '270 40% 98%',
    '--border': '270 40% 20%',
    '--input': '270 40% 20%',
    '--ring': '270 70% 60%',
    '--radius': '0.5rem',
  },
  green: {
    '--background': '150 50% 8%',
    '--foreground': '150 40% 98%',
    '--card': '150 50% 10%',
    '--card-foreground': '150 40% 98%',
    '--popover': '150 50% 10%',
    '--popover-foreground': '150 40% 98%',
    '--primary': '150 70% 45%',
    '--primary-foreground': '150 40% 98%',
    '--secondary': '150 40% 18%',
    '--secondary-foreground': '150 40% 98%',
    '--muted': '150 40% 18%',
    '--muted-foreground': '150 20.2% 65.1%',
    '--accent': '150 40% 18%',
    '--accent-foreground': '150 40% 98%',
    '--destructive': '0 62.8% 30.6%',
    '--destructive-foreground': '150 40% 98%',
    '--border': '150 40% 20%',
    '--input': '150 40% 20%',
    '--ring': '150 70% 45%',
    '--radius': '0.5rem',
  },
}

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  const colors = themeColors[theme]
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  root.classList.remove('light', 'dark', 'blue', 'purple', 'green')
  root.classList.add(theme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      toggleTheme: () => {
        const themes: Theme[] = ['light', 'dark', 'blue', 'purple', 'green']
        const currentIndex = themes.indexOf(get().theme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        set({ theme: nextTheme })
        applyTheme(nextTheme)
      },
    }),
    {
      name: 'devtools-theme',
    }
  )
)

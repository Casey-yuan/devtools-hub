import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MarkdownDoc {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

interface MarkdownState {
  docs: MarkdownDoc[]
  activeDocId: string | null
  addDoc: (title: string, content: string) => string
  updateDoc: (id: string, updates: Partial<Omit<MarkdownDoc, 'id' | 'createdAt'>>) => void
  deleteDoc: (id: string) => void
  setActiveDoc: (id: string | null) => void
  getActiveDoc: () => MarkdownDoc | undefined
}

export const useMarkdownStore = create<MarkdownState>()(
  persist(
    (set, get) => ({
      docs: [],
      activeDocId: null,
      addDoc: (title, content) => {
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
        const doc: MarkdownDoc = {
          id,
          title,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({
          docs: [doc, ...state.docs],
          activeDocId: id,
        }))
        return id
      },
      updateDoc: (id, updates) => {
        set((state) => ({
          docs: state.docs.map((doc) =>
            doc.id === id
              ? { ...doc, ...updates, updatedAt: Date.now() }
              : doc
          ),
        }))
      },
      deleteDoc: (id) => {
        set((state) => {
          const filtered = state.docs.filter((d) => d.id !== id)
          return {
            docs: filtered,
            activeDocId: state.activeDocId === id ? (filtered[0]?.id || null) : state.activeDocId,
          }
        })
      },
      setActiveDoc: (id) => set({ activeDocId: id }),
      getActiveDoc: () => {
        const { docs, activeDocId } = get()
        return docs.find((d) => d.id === activeDocId)
      },
    }),
    {
      name: 'devtools-markdown-docs',
    }
  )
)

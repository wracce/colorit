import { create } from 'zustand'

interface ColorizeState {
  originalImage: string | null
  colorizedImage: string | null
  title: string
  rating: number
  setOriginalImage: (image: string | null) => void
  setColorizedImage: (image: string | null) => void
  setTitle: (title: string) => void
  setRating: (rating: number) => void
  reset: () => void
}

export const useColorizeStore = create<ColorizeState>((set) => ({
  originalImage: null,
  colorizedImage: null,
  title: '',
  rating: 0,
  setOriginalImage: (image) => set({ originalImage: image }),
  setColorizedImage: (image) => set({ colorizedImage: image }),
  setTitle: (title) => set({ title }),
  setRating: (rating) => set({ rating }),
  reset: () => set({ originalImage: null, colorizedImage: null, title: '', rating: 0 }),
}))

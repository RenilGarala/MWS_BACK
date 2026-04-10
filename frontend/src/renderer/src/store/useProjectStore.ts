import { create } from 'zustand'
import { Part, Project } from '../types'

interface ProjectStore {
  parts: Part[]
  addPart: (part: Part) => void
  removePart: (index: number) => void
  editPart: (index: number, part: Part) => void
  clearParts: () => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  parts: [],
  addPart: (part) => set((state) => ({ parts: [...state.parts, part] })),
  removePart: (index) => set((state) => ({
    parts: state.parts.filter((_, i) => i !== index)
  })),
  editPart: (index, newPart) => set((state) => {
    const updated = [...state.parts]
    updated[index] = newPart
    return { parts: updated }
  }),
  clearParts: () => set({ parts: [] })
}))

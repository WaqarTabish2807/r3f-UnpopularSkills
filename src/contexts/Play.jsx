import { create } from "zustand";

export const usePlay = create((set) => ({
  play: false,
  end: false,
  hasScroll: false,
  setPlay: () => set((state) => ({ play: true })),
  setEnd: () => set((state) => ({ end: true })),
  setHasScroll: () => set((state) => ({ hasScroll: true })),
}));

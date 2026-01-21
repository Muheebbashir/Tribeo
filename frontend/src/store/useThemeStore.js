import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Tribeo-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Tribeo-theme", theme);
    set({ theme });
  },
}));

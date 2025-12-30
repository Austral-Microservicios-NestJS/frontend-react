import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type ModuleType } from "@/routes/modulos";

interface SidebarState {
  isSidebarOpen: boolean;
  viewMode: ModuleType;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setViewMode: (mode: ModuleType) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      viewMode: "CRM",
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: "sidebar-storage", // key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Optional: partialize if we only wanted to persist some fields, but here we want all.
      // partialize: (state) => ({ isSidebarOpen: state.isSidebarOpen, viewMode: state.viewMode }),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TaiKhoanState {
  taiKhoan: TaiKhoan | undefined;
  setTaiKhoan: (taiKhoan: TaiKhoan) => void;
  clearTaiKhoan: () => void;
  updateTaiKhoan: (updatedFields: Partial<TaiKhoan>) => void
}

export const useTaiKhoanStore = create<TaiKhoanState>()(
  persist(
    (set, get) => ({
      taiKhoan: undefined,
      setTaiKhoan: (taiKhoan) => {
        if (!taiKhoan) return;
        set({ taiKhoan });
      },
      updateTaiKhoan: (updatedFields: Partial<TaiKhoan>) => {
        const currentTaiKhoan = get().taiKhoan;
        if (!currentTaiKhoan) return;
        const updatedTaiKhoan = { ...currentTaiKhoan, ...updatedFields };
        set({ taiKhoan: updatedTaiKhoan });
      },
      clearTaiKhoan: () => {
        set({ taiKhoan: undefined });
      },
    }),
    {
      name: "taikhoan-storage",
      // Add these options for better debugging
      /*partialize: (state) => ({ taiKhoan: state.taiKhoan }),
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrating from localStorage:', state);
      },*/
    }
  )
);

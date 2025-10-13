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
        console.log('Persisting taiKhoan:', taiKhoan); // Debug log
        set({ taiKhoan });
      },
      updateTaiKhoan: (updatedFields: Partial<TaiKhoan>) => {
        const currentTaiKhoan = get().taiKhoan;
        if (!currentTaiKhoan) return;
        const updatedTaiKhoan = { ...currentTaiKhoan, ...updatedFields };
        //console.log('Updating taiKhoan:', updatedTaiKhoan); // Debug log
        set({ taiKhoan: updatedTaiKhoan });
      },
      clearTaiKhoan: () => {
        console.log('Clearing taiKhoan from store and localStorage'); // Debug log
        set({ taiKhoan: undefined });
      },
    }),
    {
      name: "taikhoan-storage",
      // Add these options for better debugging
      partialize: (state) => ({ taiKhoan: state.taiKhoan }),
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrating from localStorage:', state);
      },
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TaiKhoanState {
  taiKhoan: TaiKhoan | undefined;
  setTaiKhoan: (taiKhoan: TaiKhoan) => void;
  clearTaiKhoan: () => void;
  updateTaiKhoan: (updatedFields: Partial<TaiKhoan>) => void;
  validateAndSyncAuth: () => void;
}

export const useTaiKhoanStore = create<TaiKhoanState>()(
  persist(
    (set, get) => ({
      taiKhoan: undefined,
      setTaiKhoan: (taiKhoan) => {
        if (!taiKhoan) return;
        console.log('🔄 Setting user in store:', taiKhoan.email);
        set({ taiKhoan });
      },
      updateTaiKhoan: (updatedFields: Partial<TaiKhoan>) => {
        const currentTaiKhoan = get().taiKhoan;
        if (!currentTaiKhoan) return;
        const updatedTaiKhoan = { ...currentTaiKhoan, ...updatedFields };
        set({ taiKhoan: updatedTaiKhoan });
      },
      clearTaiKhoan: () => {
        console.log('🧹 Clearing user from store');
        set({ taiKhoan: undefined });
      },
      validateAndSyncAuth: () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          const userStr = localStorage.getItem('user');
          const currentUser = get().taiKhoan;
          
          console.log('🔍 Validating auth state:', {
            hasToken: !!token,
            hasUserInStorage: !!userStr,
            hasUserInStore: !!currentUser
          });
          
          if (!token || !userStr) {
            // Tokens missing, clear the store
            if (currentUser) {
              console.log('⚠️ Tokens missing but user in store, clearing...');
              set({ taiKhoan: undefined });
            }
          } else if (!currentUser && userStr) {
            // Store empty but tokens exist, restore user
            try {
              const user = JSON.parse(userStr);
              console.log('🔄 Restoring user to store from localStorage');
              set({ taiKhoan: user });
            } catch (error) {
              console.error('❌ Error parsing user from localStorage:', error);
              localStorage.removeItem('user');
            }
          }
        }
      },
    }),
    {
      name: "taikhoan-storage",
      onRehydrateStorage: () => (state) => {
        console.log('💾 Rehydrating store from localStorage:', state?.taiKhoan?.email);
        // Validate auth state after rehydration
        setTimeout(() => {
          state?.validateAndSyncAuth();
        }, 100);
      },
    }
  )
);

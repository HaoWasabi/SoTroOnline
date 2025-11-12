import { create } from "zustand";

interface TaiKhoanState {
  taiKhoan: TaiKhoan | undefined;
  isHydrated: boolean;
  setTaiKhoan: (taiKhoan: TaiKhoan) => void;
  clearTaiKhoan: () => void;
  updateTaiKhoan: (updatedFields: Partial<TaiKhoan>) => void;
  validateAndSyncAuth: () => void;
  saveUserToSessionStorage: (user: TaiKhoan) => void;
  loadUserFromSessionStorage: () => TaiKhoan | null;
  removeUserFromStorages: () => void;
  migrateUserStorage: () => void;
  hydrate: () => void;
}

export const useTaiKhoanStore = create<TaiKhoanState>()((set, get) => ({
  taiKhoan: undefined,
  isHydrated: false,
  
  hydrate: () => {
    if (typeof window !== 'undefined' && !get().isHydrated) {
      const store = get();
      
      // Run migration first
      store.migrateUserStorage();
      
      // Load user from sessionStorage
      const userFromSession = store.loadUserFromSessionStorage();
      const token = localStorage.getItem('accessToken');
      
      // Set hydrated state and user if available
      set({ 
        isHydrated: true, 
        taiKhoan: userFromSession || undefined 
      });
      
      // Run validation
      store.validateAndSyncAuth();
    }
  },
  
  setTaiKhoan: (taiKhoan) => {
    if (!taiKhoan) return;
    
    // Save to sessionStorage and update state
    get().saveUserToSessionStorage(taiKhoan);
    set({ taiKhoan });
  },
  
  updateTaiKhoan: (updatedFields: Partial<TaiKhoan>) => {
    const currentTaiKhoan = get().taiKhoan;
    if (!currentTaiKhoan) return;
    
    const updatedTaiKhoan = { ...currentTaiKhoan, ...updatedFields };
    
    // Update sessionStorage and state
    get().saveUserToSessionStorage(updatedTaiKhoan);
    set({ taiKhoan: updatedTaiKhoan });
  },
  
  clearTaiKhoan: () => {
    
    // Remove from sessionStorage and clear state
    get().removeUserFromStorages();
    set({ taiKhoan: undefined });
  },
  
  saveUserToSessionStorage: (user: TaiKhoan) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        //console.error('❌ Error saving user to sessionStorage:', error);
      }
    }
  },
  
  loadUserFromSessionStorage: (): TaiKhoan | null => {
    if (typeof window !== 'undefined') {
      try {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          return user;
        }
      } catch (error) {
        //console.error('❌ Error loading user from sessionStorage:', error);
        sessionStorage.removeItem('user');
      }
    }
    return null;
  },
  
  removeUserFromStorages: () => {
    if (typeof window !== 'undefined') {
      // Remove user from sessionStorage
      sessionStorage.removeItem('user');
      
      // Remove user from localStorage if it exists (cleanup/migration)
      localStorage.removeItem('user');
      
    }
  },
  
  // Migration helper: Move user data from localStorage to sessionStorage
  migrateUserStorage: () => {
    if (typeof window !== 'undefined') {
      const userInLocalStorage = localStorage.getItem('user');
      const userInSessionStorage = sessionStorage.getItem('user');
      
      // If user exists in localStorage but not in sessionStorage, migrate it
      if (userInLocalStorage && !userInSessionStorage) {
        try {
          sessionStorage.setItem('user', userInLocalStorage);
          localStorage.removeItem('user');
        } catch (error) {
          //console.error('❌ Error migrating user data:', error);
        }
      } else if (userInLocalStorage && userInSessionStorage) {
        // Both exist, remove from localStorage to avoid confusion
        //console.log('🧹 Cleaning up duplicate user data from localStorage');
        localStorage.removeItem('user');
      }
    }
  },
  
  validateAndSyncAuth: () => {
    if (typeof window !== 'undefined' && get().isHydrated) {
      const token = localStorage.getItem('accessToken');
      const userFromSession = get().loadUserFromSessionStorage();
      const currentUser = get().taiKhoan;
      
      if (!token) {
        // No valid token, clear everything
        if (currentUser || userFromSession) {
          get().removeUserFromStorages();
          set({ taiKhoan: undefined });
        }
      } else if (!currentUser && userFromSession) {
        // Store empty but user exists in sessionStorage and token is valid
        set({ taiKhoan: userFromSession });
      } else if (currentUser && !userFromSession) {
        // User in store but not in sessionStorage, save it
        //console.log('💾 Syncing user to sessionStorage');
        get().saveUserToSessionStorage(currentUser);
      }
      
      // Clean up any old user data from localStorage
      const oldUserInLocalStorage = localStorage.getItem('user');
      if (oldUserInLocalStorage) {
        localStorage.removeItem('user');
      }
    }
  },
}));

// Initialize store with proper hydration for Next.js
if (typeof window !== 'undefined') {
  const initializeStore = () => {
    const store = useTaiKhoanStore.getState();
    store.hydrate();
  };
  
  // Initialize immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStore);
  } else {
    initializeStore();
  }
}

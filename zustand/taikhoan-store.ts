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
      
      console.log('🚀 Hydrating store from sessionStorage:', {
        hasUser: !!userFromSession,
        hasToken: !!token
      });
      
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
    console.log('🔄 Setting user in store:', taiKhoan.email);
    
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
    console.log('🧹 Clearing user from store and sessionStorage');
    
    // Remove from sessionStorage and clear state
    get().removeUserFromStorages();
    set({ taiKhoan: undefined });
  },
  
  saveUserToSessionStorage: (user: TaiKhoan) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('user', JSON.stringify(user));
        console.log('💾 User saved to sessionStorage');
      } catch (error) {
        console.error('❌ Error saving user to sessionStorage:', error);
      }
    }
  },
  
  loadUserFromSessionStorage: (): TaiKhoan | null => {
    if (typeof window !== 'undefined') {
      try {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          console.log('📖 User loaded from sessionStorage:', user.email);
          return user;
        }
      } catch (error) {
        console.error('❌ Error loading user from sessionStorage:', error);
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
      
      console.log('🧹 User information removed from both storages');
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
          console.log('🔄 Migrating user data from localStorage to sessionStorage');
          sessionStorage.setItem('user', userInLocalStorage);
          localStorage.removeItem('user');
          console.log('✅ Migration completed successfully');
        } catch (error) {
          console.error('❌ Error migrating user data:', error);
        }
      } else if (userInLocalStorage && userInSessionStorage) {
        // Both exist, remove from localStorage to avoid confusion
        console.log('🧹 Cleaning up duplicate user data from localStorage');
        localStorage.removeItem('user');
      }
    }
  },
  
  validateAndSyncAuth: () => {
    if (typeof window !== 'undefined' && get().isHydrated) {
      const token = localStorage.getItem('accessToken');
      const userFromSession = get().loadUserFromSessionStorage();
      const currentUser = get().taiKhoan;
      
      console.log('🔍 Validating auth state:', {
        hasToken: !!token,
        hasUserInSession: !!userFromSession,
        hasUserInStore: !!currentUser,
        isHydrated: get().isHydrated
      });
      
      if (!token) {
        // No valid token, clear everything
        if (currentUser || userFromSession) {
          console.log('⚠️ No token but user data exists, clearing...');
          get().removeUserFromStorages();
          set({ taiKhoan: undefined });
        }
      } else if (!currentUser && userFromSession) {
        // Store empty but user exists in sessionStorage and token is valid
        console.log('🔄 Restoring user to store from sessionStorage');
        set({ taiKhoan: userFromSession });
      } else if (currentUser && !userFromSession) {
        // User in store but not in sessionStorage, save it
        console.log('💾 Syncing user to sessionStorage');
        get().saveUserToSessionStorage(currentUser);
      }
      
      // Clean up any old user data from localStorage
      const oldUserInLocalStorage = localStorage.getItem('user');
      if (oldUserInLocalStorage) {
        console.log('🧹 Cleaning up old user data from localStorage');
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

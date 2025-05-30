// stores/authStore.ts
import { create } from 'zustand';
import { tokenStorage } from '../services/tokenStorage';
import { User } from '@/interfaces/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  initialize: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  setAuth: async (token, user) => {
    await Promise.all([
      tokenStorage.saveToken(token),
      tokenStorage.saveUser(user)
    ]);
    
    set({ token, user, isAuthenticated: true });
  },
  
  clearAuth: async () => {
    await tokenStorage.clearAll();
    set({ token: null, user: null, isAuthenticated: false });
  },
  
  initialize: async () => {
    set({ isLoading: true });
    
    try {
      const [token, user] = await Promise.all([
        tokenStorage.getToken(),
        tokenStorage.getUser()
      ]);
      
      const isAuthenticated = !!token && !!user;
      set({ token, user, isAuthenticated, isLoading: false });
      
      return isAuthenticated;
      
    } catch (error) {
      console.error('Failed to initialize auth state:', error);
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  }
}));
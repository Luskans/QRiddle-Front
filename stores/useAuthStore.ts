import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '@/lib/axios';
import { User } from '@/interfaces/auth';


interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  
  initialize: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = await SecureStore.getItemAsync('token');

      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await api.get('/user');
        console.log('getUser : ', response.data)
        
        set({user: response.data.user, token, isLoading: false, error: null});

      } else {
        set({user: null, token: null, isLoading: false, error: null});
      }

    } catch (error: any) {
      console.error('Erreur initialize : ', error.response?.data?.message || error.message);
      const message = error.response?.data?.message || 'Erreur du chargement initial.';
      await SecureStore.deleteItemAsync('token');

      set({ user: null, token: null, isLoading: false, error: message});
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data;
      console.log('login : ', response.data)

      await SecureStore.setItemAsync('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, token, isLoading: false, error: null });

    } catch (error: any) {
        console.error('Erreur login : ', error.response?.data?.message || error.message);
        const message = error.response?.data?.message || 'Erreur de connexion à votre compte.';
        set({isLoading: false, error: message});
    }
  },

  register: async (name: string, email: string, password: string, password_confirmation: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation,
      });
      const { user, token } = response.data;
      console.log('register : ', response.data)

      await SecureStore.setItemAsync('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, token, error: null, isLoading: false });

    } catch (error: any) {
      console.error('Erreur register : ', error.response?.data?.message || error.message);
      const message = error.response?.data?.message || 'Erreur de création de compte.';
      set({isLoading: false, error: message});
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await api.post('/logout');
      set({ error: null });

    } catch (error: any) {
      console.error('Erreur logout : ', error.response?.data?.message || error.message);
      const message = error.response?.data?.message || 'Erreur de déconnexion.';
      set({ error: message });

    } finally {
      await SecureStore.deleteItemAsync('token');
      delete api.defaults.headers.common['Authorization'];

      set({ 
        user: null,
        token: null,
        isLoading: false
      });
    }
  },
}));
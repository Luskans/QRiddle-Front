// import { create } from 'zustand';
// import * as SecureStore from 'expo-secure-store';

// interface AuthState {
//   user: any | null;
//   token: string | null;
//   setUser: (user: any) => void;
//   setToken: (token: string) => void;
//   logout: () => Promise<void>;
//   restoreAuth: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   token: null,

//   setUser: (user: any) => {
//     set({ user });
//     SecureStore.setItemAsync('user', JSON.stringify(user));
//   },

//   setToken: (token: string) => {
//     set({ token });
//     SecureStore.setItemAsync('token', token);
//   },

//   login: (user: any, token: string) => {
//     set({ user: user, token: token });
//     SecureStore.setItemAsync('user', JSON.stringify(user));
//     SecureStore.setItemAsync('token', token);
//   },

//   logout: async () => {
//     set({ user: null, token: null });
//     await SecureStore.deleteItemAsync('user');
//     await SecureStore.deleteItemAsync('token');
//   },

//   restoreAuth: async () => {
//     const persistedUser = await SecureStore.getItemAsync('user');
//     const persistedToken = await SecureStore.getItemAsync('token');
//     if (persistedUser && persistedToken) {
//       set({ user: JSON.parse(persistedUser), token: persistedToken });
//     }
//   }
// }));




import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  image: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  // checkEmailVerification: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  
  setError: (error: string | null) => set({ error }),

  initialize: async () => {
    set({ isLoading: true });

    try {
      const token = await SecureStore.getItemAsync('token');

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await axios.get(API_URL + '/user');
        
        set({
          user: response.data,
          token,
        });
      }

    } catch (error) {
      await SecureStore.deleteItemAsync('token');

      set({ 
        user: null, 
        token: null, 
      });

    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(API_URL + '/login', { email, password });
      const { user, token } = response.data;

      await SecureStore.setItemAsync('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, token, error: null });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          set({ error: error.response.data.message || 'Erreur lors de la connexion' });

        } else {
          set({ error: 'Aucune réponse du serveur' });
        }

      } else {
        set({ error: 'Erreur inconnue' });
      }
      console.error('Erreur lors de la connexion :', error);

    } finally {
      set({ isLoading: false });
    }
  },

  register: async (username: string, email: string, password: string, password_confirmation: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(API_URL + '/register', {
        username,
        email,
        password,
        password_confirmation,
      });
      const { user, token } = response.data;

      await SecureStore.setItemAsync('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      set({ user, token, error: null });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          set({ error: error.response.data.message || "Erreur lors de l'inscription" });

        } else {
          set({ error: "Aucune réponse du serveur" });
        }
        
      } else {
        set({ error: "Erreur inconnue" });
      }
      console.error("Erreur lors de l'inscription :", error);

    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await axios.post(API_URL + '/logout');

    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);

    } finally {
      await SecureStore.deleteItemAsync('token');
      delete axios.defaults.headers.common['Authorization'];

      set({ 
        user: null,
        token: null,
        isLoading: false,
        error: null
      });
    }
  },

  // checkEmailVerification: async () => {
  //   try {
  //     const response = await api.get('/user');
  //     set({ 
  //       user: response.data,
  //       isLoading: false 
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // },
}));
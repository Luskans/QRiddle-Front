// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Récupérer l'URL de base de l'API depuis les variables d'environnement
// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// // Interface pour les données utilisateur (à adapter selon ce que retourne votre API /user)
// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   image: string; // URL de l'avatar
//   email_verified_at?: string | null; // Optionnel: si vous gérez la vérification d'email
//   // Ajoutez d'autres champs si nécessaire (roles, etc.)
// }

// // Interface pour les données de connexion
// interface LoginCredentials {
//   email: string;
//   password: string;
//   device_name?: string; // Recommandé pour Sanctum pour nommer le token
// }

// // Interface pour les données d'inscription
// interface RegisterData {
//   name: string;
//   email: string;
//   password: string;
//   password_confirmation: string;
// }

// // Interface pour l'état du store
// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean; // Dérivé de la présence du token/user
//   isLoading: boolean; // Pour les opérations async (login, register, fetchUser)
//   error: string | null; // Pour stocker les messages d'erreur d'authentification

//   // Actions
//   login: (credentials: LoginCredentials) => Promise<boolean>; // Retourne true en cas de succès
//   register: (userData: RegisterData) => Promise<boolean>; // Retourne true en cas de succès
//   logout: () => Promise<void>;
//   fetchUser: () => Promise<boolean>; // Récupère l'utilisateur basé sur le token stocké
//   setUser: (user: User | null) => void; // Setter manuel (utile pour màj profil)
//   setToken: (token: string | null) => void; // Setter manuel (principalement pour la persistance)
//   clearAuth: () => void; // Réinitialise l'état
//   _checkAuthStatus: () => void; // Helper interne pour synchroniser isAuthenticated
// }

// // Création du store avec persistance
// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       // --- État Initial ---
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       isLoading: false, // Important: initialiser à false
//       error: null,

//       // --- Actions ---

//       // Vérifie et met à jour le statut d'authentification
//       _checkAuthStatus: () => {
//         const token = get().token;
//         const user = get().user;
//         // Considère authentifié si token ET user sont présents
//         set({ isAuthenticated: !!token && !!user });
//       },

//       // Met à jour l'utilisateur et vérifie le statut
//       setUser: (user) => {
//         set({ user });
//         get()._checkAuthStatus(); // Met à jour isAuthenticated
//       },

//       // Met à jour le token et vérifie le statut
//       setToken: (token) => {
//         set({ token });
//         get()._checkAuthStatus(); // Met à jour isAuthenticated
//         // Configurer Axios pour utiliser ce token par défaut pour les requêtes futures
//         if (token) {
//           axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         } else {
//           delete axios.defaults.headers.common['Authorization'];
//         }
//       },

//       // Réinitialise complètement l'état d'authentification
//       clearAuth: () => {
//         get().setToken(null); // Efface le token et met à jour axios/isAuthenticated
//         set({ user: null, isLoading: false, error: null });
//       },

//       // Connexion de l'utilisateur
//       login: async (credentials) => {
//         set({ isLoading: true, error: null });
//         try {
//           // Ajouter device_name si non fourni
//           const credsToSend = {
//              device_name: 'mobileApp', // Nommez l'appareil/token
//              ...credentials
//           };
//           // Appel API pour le login
//           const response = await axios.post(`${API_URL}/login`, credsToSend);

//           // Supposons que la réponse contient le token et potentiellement l'utilisateur
//           // Ex: { token: '...', user: { ... } } ou juste { token: '...' }
//           const token = response.data.token;
//           let user = response.data.user; // Peut être null si l'API ne le retourne pas ici

//           if (!token) {
//              throw new Error("Token manquant dans la réponse de connexion.");
//           }

//           get().setToken(token); // Stocke le token et configure Axios

//           // Si l'utilisateur n'est pas retourné par /login, le fetcher séparément
//           if (!user) {
//              const userFetched = await get().fetchUser(); // Tente de fetcher l'utilisateur avec le nouveau token
//              if (!userFetched) {
//                 // Si fetchUser échoue juste après le login, c'est un problème
//                 throw new Error("Impossible de récupérer les informations utilisateur après connexion.");
//              }
//           } else {
//              // Si l'utilisateur est retourné par /login, le stocker directement
//              get().setUser(user);
//           }

//           set({ isLoading: false, error: null });
//           return true; // Succès

//         } catch (error: any) {
//           console.error("Erreur de connexion:", error.response?.data || error.message);
//           const message = error.response?.data?.message || error.message || "Échec de la connexion.";
//           get().clearAuth(); // Nettoyer en cas d'erreur
//           set({ error: message, isLoading: false }); // Stocker l'erreur
//           return false; // Échec
//         }
//       },

//       // Inscription de l'utilisateur
//       register: async (userData) => {
//         set({ isLoading: true, error: null });
//         try {
//           // Appel API pour l'inscription
//           await axios.post(`${API_URL}/register`, userData);

//           // Après l'inscription, que se passe-t-il ?
//           // Option 1: L'utilisateur doit se connecter manuellement.
//           // Option 2: L'API retourne un token et connecte automatiquement (moins courant avec email verification).
//           // Option 3: L'utilisateur doit vérifier son email.

//           // Ici, on suppose l'option 1 ou 3 (pas de connexion auto)
//           set({ isLoading: false, error: null });
//           // Peut-être afficher un message de succès ou de vérification d'email
//           return true; // Succès de l'inscription (mais pas forcément connecté)

//         } catch (error: any) {
//           console.error("Erreur d'inscription:", error.response?.data || error.message);
//           // Gérer les erreurs de validation spécifiques ?
//           const message = error.response?.data?.message || error.message || "Échec de l'inscription.";
//           set({ error: message, isLoading: false });
//           return false; // Échec
//         }
//       },

//       // Déconnexion de l'utilisateur
//       logout: async () => {
//         const token = get().token;
//         if (!token) return; // Déjà déconnecté

//         set({ isLoading: true }); // Optionnel: indiquer le chargement pendant la déconnexion
//         try {
//           // Appel API pour invalider le token côté serveur (IMPORTANT pour Sanctum)
//           await axios.post(`${API_URL}/logout`);
//         } catch (error: any) {
//           // Même si l'appel échoue (ex: token déjà expiré), on déconnecte côté client
//           console.error("Erreur lors de la déconnexion serveur (token peut-être déjà invalide):", error.response?.data || error.message);
//         } finally {
//           // Toujours nettoyer l'état local et le stockage
//           get().clearAuth(); // Réinitialise user, token, isAuthenticated, isLoading, error
//           // AsyncStorage.removeItem('auth-storage'); // Normalement géré par clearAuth + persist
//         }
//       },

//       // Récupérer les informations de l'utilisateur authentifié
//       fetchUser: async () => {
//         const token = get().token;
//         if (!token) {
//           // console.log("fetchUser: Pas de token, impossible de fetcher.");
//           get().clearAuth(); // S'assurer que tout est propre s'il n'y a pas de token
//           return false;
//         }

//         set({ isLoading: true, error: null });
//         try {
//           // Appel API pour récupérer l'utilisateur
//           const response = await axios.get<User>(`${API_URL}/user`); // L'URL de votre API qui retourne l'utilisateur authentifié
//           get().setUser(response.data); // Met à jour l'utilisateur et isAuthenticated
//           set({ isLoading: false });
//           return true; // Succès

//         } catch (error: any) {
//           console.error("Erreur fetchUser:", error.response?.data || error.message);
//           // Si 401 ou autre erreur, le token est probablement invalide/expiré
//           const message = error.response?.data?.message || error.message || "Session invalide ou expirée.";
//           get().clearAuth(); // Déconnecter l'utilisateur si le fetch échoue
//           set({ error: message, isLoading: false }); // Garder l'erreur pour info
//           return false; // Échec
//         }
//       },
//     }),
//     {
//       // --- Configuration de la Persistance ---
//       name: 'auth-storage', // Nom de la clé dans AsyncStorage
//       storage: createJSONStorage(() => AsyncStorage), // Utiliser AsyncStorage
//       partialize: (state) => ({
//         // Ne persister que le token et l'utilisateur (optionnel)
//         token: state.token,
//         // user: state.user, // Persister l'utilisateur est optionnel, fetchUser au démarrage est souvent préférable
//       }),
//       // Optionnel: Action après réhydratation (chargement depuis AsyncStorage)
//       onRehydrateStorage: (state) => {
//         console.log("AuthStore: Réhydratation depuis AsyncStorage terminée.");
//         return (state, error) => {
//           if (error) {
//             console.error("AuthStore: Erreur lors de la réhydratation:", error);
//           } else if (state?.token) {
//             console.log("AuthStore: Token trouvé lors de la réhydratation, configuration d'Axios et fetchUser...");
//             // Reconfigurer Axios avec le token chargé
//             axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
//             // Tenter de récupérer les infos utilisateur au démarrage si un token existe
//             state.fetchUser(); // Appelle fetchUser après chargement du token
//           } else {
//              console.log("AuthStore: Pas de token trouvé lors de la réhydratation.");
//              // S'assurer qu'Axios n'a pas de token périmé
//              delete axios.defaults.headers.common['Authorization'];
//           }
//         };
//       },
//     }
//   )
// );

// // Configurer Axios pour inclure les en-têtes nécessaires par défaut
// axios.defaults.headers.common['Accept'] = 'application/json';
// axios.defaults.headers.common['Content-Type'] = 'application/json';
// axios.defaults.withCredentials = true; // Important pour Sanctum si vous utilisez les cookies (moins courant avec les tokens)
// axios.defaults.withXSRFToken = true; // Important pour la protection CSRF de Laravel Sanctum si vous utilisez les cookies

// // Récupérer le token initial depuis le store (au cas où il serait déjà chargé par persist)
// const initialToken = useAuthStore.getState().token;
// if (initialToken) {
//   axios.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
// }
















import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import api from '@/lib/axios';
import { User } from '@/interfaces/auth';


interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
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
  
  setError: (error: string | null) => set({ error }),

  initialize: async () => {
    set({ isLoading: true });

    try {
      const token = await SecureStore.getItemAsync('token');

      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await api.get('/user');
        
        set({
          user: response.data,
          token,
          isLoading: false
        });

      } else {
        set({
          user: null,
          token: null,
          isLoading: false
        });
      }

    } catch (error) {
      await SecureStore.deleteItemAsync('token');

      set({ 
        user: null, 
        token: null, 
        isLoading: false
      });

    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data;

      await SecureStore.setItemAsync('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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
      const response = await api.post('/register', {
        username,
        email,
        password,
        password_confirmation,
      });
      const { user, token } = response.data;

      await SecureStore.setItemAsync('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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
      await api.post('/logout');

    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);

    } finally {
      await SecureStore.deleteItemAsync('token');
      delete api.defaults.headers.common['Authorization'];

      set({ 
        user: null,
        token: null,
        isLoading: false,
        error: null
      });
    }
  },
}));
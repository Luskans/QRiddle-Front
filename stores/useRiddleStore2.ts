import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

export interface RiddleList {
  riddles: RiddleItem[];
  offset: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RiddleItem {
  id: number;
  title: string;
  is_private: boolean;
  latitude: string;
  longitude: string;
  status: 'active' | 'draft' | 'disabled';
  updated_at: string;
  steps_count: number;
  reviews_count: number;
  reviews_avg_rating: number;
  reviews_avg_difficulty: number;
}

export interface Riddle {
  id: number;
  creator_id: number;
  title: string;
  description: string;
  is_private: boolean;
  password?: string | null;
  latitude: string;
  longitude: string;
  status: 'active' | 'draft' | 'disabled';
  updated_at: string;
  stepsCount: number;
  reviewsCount: number;
  averageRating: number;
  averageDifficulty: number;
}

export interface RiddleById {
  riddle: Riddle | null;
  isLoading: boolean;
  error: string | null;
}

export interface RiddleFormData {
  title: string;
  description: string;
  is_private: boolean;
  status: 'active' | 'draft' | 'disabled';
  latitude: string;
  longitude: string;
}

export interface RiddleStore {
  publicList: RiddleList;
  createdList: RiddleList;
  riddleById: {
    [riddleId: string]: RiddleById
  };

  fetchPublicList: (params?: { limit?: number; offset?: number; refresh?: boolean }) => Promise<void>;
  fetchCreatedList: (params?: { limit?: number; offset?: number; refresh?: boolean }) => Promise<void>;
  fetchRiddleById: (id: string) => Promise<void>;
  createRiddle: (data: RiddleFormData) => Promise<Riddle | null>;
  updateRiddle: (id: string, data: Partial<RiddleFormData>) => Promise<Riddle | null>;
  deleteRiddle: (id: string) => Promise<boolean>;
}

export const defaultRiddleByIdState: RiddleById = {
  riddle: null,
  isLoading: false,
  error: null,
};


// --- Store ---

export const useRiddleStore = create<RiddleStore>((set, get) => ({
  publicList: { 
    riddles: [],
    offset: 0,
    hasMore: true,
    isLoading: false,
    error: null,
  },
  createdList: { 
    riddles: [],
    offset: 0,
    hasMore: true,
    isLoading: false,
    error: null,
  },
  riddleById: {},

  // --- Fetch liste des riddles publiques (GET /riddles) ---
  fetchPublicList: async ({ limit, offset, refresh = false } = {}) => {
    const currentState = get().publicList;
    const currentOffset = refresh ? 0 : offset ?? currentState.offset;

    if (currentState.isLoading || (!currentState.hasMore && !refresh)) {
      return;
    }

    set((state) => ({
      publicList: { ...state.publicList, isLoading: true, error: null },
    }));

    try {
      const response = await axios.get<{ riddles: Riddle[], meta: { total: number, hasMore?: boolean } }>(`${API_URL}/riddles`, {
        params: { limit, offset: currentOffset }
      });
      const { riddles, meta } = response.data;
      console.log("FETCH PUBLIC LIST", response.data)

      set((state) => {
        const existingRiddles = state.publicList.riddles;
        const newRiddles = refresh || currentOffset === 0 ? riddles : [...existingRiddles, ...riddles];
        const uniqueRiddles = Array.from(new Map(newRiddles.map(r => [r.id, r])).values());

        return {
          publicList: {
            riddles: uniqueRiddles,
            offset: currentOffset + riddles.length,
            isLoading: false,
            error: null,
            hasMore: meta.hasMore ?? (riddles.length === limit),
          }
        };
      });

    } catch (error: any) {
      console.error('Erreur fetchPublicList:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement des énigmes';
      set((state) => ({
        publicList: { ...state.publicList, isLoading: false, error: message }
      }));
    }
  },

  // --- Fetch liste des riddles créées (GET /users/me/riddles/created) ---
  fetchCreatedList: async ({ limit = 20, offset, refresh = false } = {}) => {
    const currentState = get().createdList;
    const currentOffset = refresh ? 0 : offset ?? currentState.offset;

    if (currentState.isLoading || (!currentState.hasMore && !refresh)) {
      return;
    }

    set((state) => ({
      createdList: { ...state.createdList, isLoading: true, error: null },
    }));

    try {
      const response = await axios.get<{ riddles: Riddle[], meta: { total: number, hasMore?: boolean } }>(`${API_URL}/users/me/riddles/created`, {
        params: { limit, offset: currentOffset }
      });
      const { riddles, meta } = response.data;
      console.log("FETCH CREATED LIST", response.data)

      set((state) => {
        const existingRiddles = state.createdList.riddles;
        const newRiddles = refresh || currentOffset === 0 ? riddles : [...existingRiddles, ...riddles];
        const uniqueRiddles = Array.from(new Map(newRiddles.map(r => [r.id, r])).values());

        return {
          createdList: {
            riddles: uniqueRiddles,
            offset: currentOffset + riddles.length,
            isLoading: false,
            error: null,
            hasMore: meta.hasMore ?? (riddles.length === limit),
          }
        };
      });

    } catch (error: any) {
      console.error('Erreur fetchCreatedList:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement des énigmes créées';
      set((state) => ({
        createdList: { ...state.createdList, isLoading: false, error: message }
      }));
    }
  },

  // --- Fetch détail d'un riddle (GET /riddles/{id}) ---
  fetchRiddleById: async (id: string) => {
    const currentState = get().riddleById[id] ?? defaultRiddleByIdState;

    if (currentState.isLoading) {
      return;
    }

    set((state) => ({
      riddleById: {
        ...state.riddleById,
        [id]: { 
          ...currentState,
          isLoading: true,
          error: null 
        },
      },
    }));

    try {
      const response = await axios.get(`${API_URL}/riddles/${id}`);
      const data = response.data.data;
      console.log("FETCH RIDDLE DETAIL", response.data)

      set((state) => ({
        riddleById: {
          ...state.riddleById,
          [id]: {
            riddle: data,
            isLoading: false,
            error: null,
          },
        },
      }));

    } catch (error: any) {
      console.error(`Erreur fetchRiddleById (${id}):`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement du détail de l\'énigme';
      set(state => ({
        riddleById: {
          ...state.riddleById,
          [id]: {
            ...currentState,
            isLoading: false,
            error: message,
          }
        }
      }));
    }
  },

  // --- Création d'une énigme (POST /riddles) ---
  createRiddle: async (data: RiddleFormData): Promise<Riddle | null> => {
    try {
      const response = await axios.post(`${API_URL}/riddles`, data);
      const newRiddle = response.data.data;
      console.log("CREATE RIDDLE", response.data);

      set((state) => ({
        // clear created list
        // clear public list
      }));

      return newRiddle;

    } catch (error: any) {
      console.error('Erreur createRiddle:', error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur lors de la création de l'énigme";
      return null;
    }
  },

  // --- Mise à jour d'une énigme (PUT /riddles/{id}) ---
  updateRiddle: async (id: string, data: Partial<RiddleFormData>): Promise<Riddle | null> => {
    try {
      const response = await axios.put(`${API_URL}/riddles/${id}`, data);
      const updatedRiddle = response.data.data;
      console.log("UPDATE RIDDLE", response.data);

      set((state) => ({
        // clear created list
        // clear public list
        riddleById: {
          ...state.riddleById,
          [id]: {
            riddle: updatedRiddle,
            isLoading: false,
            error: null,
          },
        },
      }));

      return updatedRiddle;

    } catch (error: any) {
      console.error(`Erreur updateRiddle (${id}):`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur mise à jour de l\'énigme';
      set(state => ({
        riddleById: {
          ...state.riddleById,
          [id]: {
            ...state.riddleById[id],
            isLoading: false,
            error: message,
          }
        }
      }));

      return null;
    }
  },

  // --- Suppression d'une énigme (DELETE /riddles/{id}) ---
  deleteRiddle: async (id: string): Promise<boolean> => {
    try {
      const response = await axios.delete(`${API_URL}/riddles/${id}`);
      console.log("DELETE RIDDLE", response.data);

      // set((state) => {
      //   // clear les listes et detail
      // });

      return true;

    } catch (error: any) {
      console.error(`Erreur deleteRiddle (${id}):`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur suppression de l\'énigme';
      set(state => ({
        riddleById: {
          ...state.riddleById,
          [id]: {
            ...state.riddleById[id],
            isLoading: false,
            error: message,
          }
        }
      }));
      return false;
    }
  },

}));
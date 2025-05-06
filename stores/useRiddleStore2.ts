import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

export interface RiddleList {
  riddles: CommonListItem[] | CreatedListItem[];
  offset: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ListItem {
  id: number;
  title: string;
  is_private: boolean;
  latitude: string;
  longitude: string;
  updated_at: string;
}

export interface CommonListItem extends ListItem {
  creator_id: number;
  stepCount: number;
  averageRating: number;
  averageDifficulty: number;
}

export interface CreatedListItem extends ListItem {
  status: 'active' | 'draft' | 'disabled';
}

export interface DetailItem extends ListItem {
  creator_id: number;
  description: string;
  password?: string | null;
  averageRating: number;
  averageDifficulty: number;
  status: 'active' | 'draft' | 'disabled';
}

export interface RiddleDetail {
  riddle: DetailItem | null;
  isLoading: boolean;
  error: string | null;
}

export interface RiddleStoreState {
  createdList: RiddleList;
  riddleDetail: RiddleDetail;

  fetchCreatedList: (params?: { limit?: number; offset?: number; refresh?: boolean }) => Promise<void>;
  fetchRiddleDetail: (id: string) => Promise<void>;
}


// --- Store ---

export const useRiddleStore = create<RiddleStoreState>((set, get) => ({
  createdList: { 
    riddles: [],
    offset: 0,
    hasMore: true,
    isLoading: false,
    error: null,
  },
  riddleDetail: { 
    riddle: null,
    isLoading: false,
    error: null,
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
      const response = await axios.get<{ riddles: CreatedListItem[], meta: { total: number, hasMore?: boolean } }>(`${API_URL}/users/me/riddles/created`, {
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
  fetchRiddleDetail: async (id: string) => {
    set((state) => ({
      riddleDetail: { ...state.riddleDetail, isLoading: true, error: null },
    }));

    try {
      const response = await axios.get<DetailItem>(`${API_URL}/riddles/${id}`);
      const riddleData = response.data;
      console.log("FETCH RIDDLE DETAIL", response.data)

      set({ 
        riddleDetail: { riddle: riddleData, isLoading: false, error: null }
      });

    } catch (error: any) {
      console.error(`Erreur fetchRiddleDetail (${id}):`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement du détail de l\'énigme';
      set({ 
        riddleDetail: { riddle: null, isLoading: false, error: message }
      });
    }
  },

}));
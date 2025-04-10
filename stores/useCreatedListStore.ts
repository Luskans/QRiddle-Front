import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Riddle {
  id: number;
  title: string;
  is_private: boolean;
  status: 'active' | 'draft' | 'disabled';
  created_at: string;
}

interface CreatedListState {
  riddles: Riddle[];
  offset: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  fetchRiddlesData: (params: { limit?: number; offset?: number; }) => Promise<void>;
  resetRiddles: () => void;
}

export const useCreatedListStore = create<CreatedListState>((set, get) => ({
  riddles: [],
  offset: 0,
  hasMore: true,
  isLoading: false,
  error: null,

  fetchRiddlesData: async ({ limit = 20, offset = 0 }) => {
    if (!get().hasMore) return;

    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/riddles/created/list`, {
        params: { limit, offset }
      });
      const data = response.data;

      set((state) => ({
        riddles: [...state.riddles, ...data.riddles],
        offset: offset + limit,
        hasMore: data.riddles.length === limit,
      }));

    } catch (error) {
      console.error('Erreur lors du fetch des données created:', error);
      console.error('Erreur lors du fetch des données created2:', error.message);
      console.error('Erreur lors du fetch des données created3:', error.response.data.message);
      set({ error: 'Erreur lors du chargement de created' });

    } finally {
      set({ isLoading: false });
    }
  },

  resetRiddles: () => set({ riddles: [], offset: 0, hasMore: true })
}));
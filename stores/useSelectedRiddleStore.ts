import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface GameSession {
  id: number;
  player_id: number;
  riddle_id: number;
  score: number;
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  riddle_id: number;
  content: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Hint {
  id: number;
  order_number: number;
  type: 'text' | 'image' | 'audio';
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Step {
  id: number;
  order_number: number;
  qr_code: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  hints: Hint[];
}

export interface Riddle {
  id: number;
  title: string;
  description: string;
  is_private: boolean;
  status: 'active' | 'draft' | 'disabled';
  created_at: string;
  updated_at: string;
  difficulty: number;
  latitude: string;
  longitude: string;
  game_sessions: GameSession[];
  reviews: Review[];
  steps: Step[];
}

export interface SelectedRiddleState {
  riddle: Riddle | null;
  isLoading: boolean;
  error: string | null;
  fetchRiddleData: (params: { id: string }) => Promise<void>;
}

export const useSelectedRiddleStore = create<SelectedRiddleState>((set, get) => ({
  riddle: null,
  isLoading: false,
  error: null,

  setError: (error: string | null) => set({ error }),

  fetchRiddleData: async ({ id }) => {

    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/riddles/${id}`);
      const data = response.data;

      set({
        riddle: data.riddle,
      });

    } catch (error) {
      console.error('Erreur lors du fetch des données selected:', error);
      console.error('Erreur lors du fetch des données selected2:', error.message);
      console.error('Erreur lors du fetch des données selected3:', error.response.data.message);
      set({ error: 'Erreur lors du chargement de selected' });

    } finally {
      set({ isLoading: false });
    }
  },
}));
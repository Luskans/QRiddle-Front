import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface ActiveGameSessionState {

}

export interface HomeState {
  createdCount: number,
  playedCount: number,
  activeGameSession: ActiveGameSessionState | null,
  isLoading: boolean;
  error: string | null;
  fetchHomeData: () => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
  createdCount: 0,
  playedCount: 0,
  activeGameSession: null,
  isLoading: false,
  error: null,

  // --- Fetch Liste Publique (GET /home) ---
  fetchHomeData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/home`);
      console.log("FETCH HOME DATA", response.data)
      
      set({
        createdCount: response.data.createdCount,
        playedCount: response.data.playedCount,
        activeGameSession: response.data.activeGameSession,
        isLoading: false
      });

    } catch (error: any) {
      console.error("Erreur fetch dashboard data:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur chargement du tableau de bord";
      set({
        createdCount: 0,
        playedCount: 0,
        activeGameSession: null,
        isLoading: false,
        error: message,
      });
    }
  },
}));
import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Ranking {
  name: string;
  image: string;
  score: number;
}

export interface UserRank {
  score: number;
  rank: number;
}

export interface GlobalScoreState {
  ranking: {
    week: Ranking[];
    month: Ranking[];
    all: Ranking[];
  }
  userRank: {
    week: UserRank | null;
    month: UserRank | null;
    all: UserRank | null;
  }
  offset : number;
  isLoading: boolean;
  error: string | null;
  fetchGlobalScore: (params: { limit?: number; offset?: number; }) => Promise<void>;
  resetGlobalScore: () => void;

}

export const useGlobalScoreStore = create<GlobalScoreState>((set, get) => ({
  ranking: { week: [], month: [], all: [] },
  userRank: { week: null, month: null, all: null },
  offset: 0,
  isLoading: false,
  error: null,

  fetchGlobalScore: async ({ limit = 20, offset = 0 }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(API_URL + '/leaderboard', {
        params: { limit, offset }
      });
      const data = response.data;

      set((state) => ({
        ranking: {
          week: [...state.ranking.week, ...data.ranking.week],
          month: [...state.ranking.month, ...data.ranking.month],
          all: [...state.ranking.all, ...data.ranking.all]
        },
        userRank: data.userRank,
        offset: offset + limit
      }));

    } catch (error) {
      console.error('Erreur lors du fetch des données Leaderboard:', error);
      set({ error: 'Erreur lors du chargement de home' });

    } finally {
      set({ isLoading: false });
    }
  },

  resetGlobalScore: () => {
    set({
      ranking: { week: [], month: [], all: [] },
      offset: 0,
    });
  },
}));
import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const CACHE_DURATION = Number(process.env.EXPO_PUBLIC_CACHE_DURATION);
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

interface Ranking {
  name: string;
  image: string;
  score: number;
}

interface UserRank {
  score: number;
  rank: number;
}

export interface HomeState {
  notificationsCount: number;
  activeRiddle: any;
  participatedCount: number;
  createdCount: number;
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
  lastFetched: number | null;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  fetchHomeData: (params: { limit: number; offset?: number; }) => Promise<void>;
}

export const useHomeStore = create<HomeState>((set, get) => ({
  notificationsCount: 0,
  activeRiddle: null,
  participatedCount: 0,
  createdCount: 0,
  ranking: { week: [], month: [], all: [] },
  userRank: { week: null, month: null, all: null },
  lastFetched: null,
  isLoading: false,
  error: null,

  setError: (error: string | null) => set({ error }),

  fetchHomeData: async (limit, offset = 0) => {
    const now = Date.now();
    const lastFetched = get().lastFetched;
    if (lastFetched !== null && (now - lastFetched < CACHE_DURATION)) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(API_URL + '', {
        params: { limit, offset }
      });
      const data = response.data;

      set({
        notificationsCount: data.notificationsCount,
        activeRiddle: data.activeRiddle,
        participatedCount: data.participatedCount,
        createdCount: data.createdCount,
        ranking: data.ranking,
        userRank: data.userRank,
        lastFetched: now,
      });

    } catch (error) {
      console.error('Erreur lors du fetch des données Home:', error);
      console.error('Erreur lors du fetch des données Home2:', error.message);
      console.error('Erreur lors du fetch des données Home3:', error.response.data.message);
      set({ error: 'Erreur lors du chargement de home' });

    } finally {
      set({ isLoading: false });
    }
  },
}));
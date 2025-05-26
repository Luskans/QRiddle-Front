import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { User } from './useAuthStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// INTERFACES

export interface GlobalLeaderboard {
  list: LeaderboardItem[];
  offset: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

export interface LeaderboardItem {
  score: number;
  name: string;
  image: string;
  user_id: number;
}

export interface UserRank {
  score: number;
  rank: number;
}

export interface RiddleLeaderboard {
  list: LeaderboardItem[];
  userRank: UserRank | null;
  offset: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

export interface LeaderboardState {
  globalLeaderboard: {
    week: GlobalLeaderboard;
    month: GlobalLeaderboard;
    all: GlobalLeaderboard;
  };
  globalUserRanks: {
    week: UserRank | null;
    month: UserRank | null;
    all: UserRank | null;
    isLoading: boolean;
    error: string | null;
  };
  riddleLeaderboard: {
    [riddleId: string]: RiddleLeaderboard;
  };
  fetchGlobalLeaderboard: (period: 'week' | 'month' | 'all', params?: { limit?: number; offset?: number; }) => Promise<void>;
  fetchGlobalUserRank: () => Promise<void>;
  fetchRiddleLeaderboard: (riddleId: string, params?: { limit?: number; offset?: number; }) => Promise<void>;
  clearRiddleLeaderboard: (riddleId: string) => void;
  clearGlobalLeaderboard: () => void;
  clearGlobalLeaderboardPeriod: (period: 'week' | 'month' | 'all') => void;
}

// INITIAL STATES

export const defaultGlobalLeaderboard: GlobalLeaderboard = {
  list: [],
  offset: 0,
  isLoading: false,
  hasMore: true,
  error: null,
};

export const defaultRiddleLeaderboard: RiddleLeaderboard = {
  list: [],
  userRank: null,
  offset: 0,
  isLoading: false,
  hasMore: true,
  error: null,
};

// STORE

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  globalLeaderboard: { 
    week: { ...defaultGlobalLeaderboard },
    month: { ...defaultGlobalLeaderboard },
    all: { ...defaultGlobalLeaderboard }
  },
  globalUserRanks: { week: null, month: null, all: null, isLoading: false, error: null },
  riddleLeaderboard: {},

  fetchGlobalLeaderboard: async (period: 'week' | 'month' | 'all', { limit = 20, offset = 0 } = {}) => {
    if (!get().globalLeaderboard[period].hasMore) return;

    set((state) => ({
      globalLeaderboard: {
        ...state.globalLeaderboard,
        [period]: { ...state.globalLeaderboard[period], isLoading: true, error: null },
      },
    }));

    try {
      const response = await axios.get(`${API_URL}/leaderboards/global`, {
        params: { period, limit, offset },
      });
      const data = response.data;

      set((state) => ({
        globalLeaderboard: {
          ...state.globalLeaderboard,
          [period]: {
            list: (offset === 0) ? data.ranking : [...state.globalLeaderboard[period].list, ...data.ranking],
            offset: offset + data.ranking.length,
            isLoading: false,
            error: null,
            hasMore: data.ranking.length === limit,
          },
        },
      }));

    } catch (error) {
      const axiosError = error as AxiosError<any>;
      console.error(`Erreur fetch classements globaux (${period}):`, axiosError.response?.data || axiosError.message);
      const message = axiosError.response?.data?.message || `Erreur de chargement du classement (${period})`;
      
      set((state) => ({
        globalLeaderboard: {
          ...state.globalLeaderboard,
          [period]: {
            ...state.globalLeaderboard[period],
            isLoading: false,
            error: message,
          },
        },
      }));
    }
  },

  fetchGlobalUserRank: async () => {
    set((state) => ({
      globalUserRanks: { ...state.globalUserRanks, isLoading: true, error: null },
    }));

    try {
      const response = await axios.get(`${API_URL}/users/me/leaderboard/global`);
      console.log("test", response.data)

      set({
        globalUserRanks: {
          week: response.data.week || null,
          month: response.data.month || null,
          all: response.data.all || null,
          isLoading: false,
          error: null,
        },
      });

    } catch (error) {
      const axiosError = error as AxiosError<any>;
      console.error('Erreur fetch rang global utilisateur:', axiosError.response?.data || axiosError.message);
      const message = axiosError.response?.data?.message || `Erreur de chargement de votre classement`;

      set((state) => ({
        globalUserRanks: {
          ...state.globalUserRanks,
          isLoading: false,
          error: message,
        },
      }));
    }
  },

  fetchRiddleLeaderboard: async (riddleId: string, { limit = 20, offset = 0 } = {}) => {
    if (get().riddleLeaderboard[riddleId] && !get().riddleLeaderboard[riddleId].hasMore) return;

    set((state) => ({
      riddleLeaderboard: {
        ...state.riddleLeaderboard,
        [riddleId]: { 
          ...state.riddleLeaderboard[riddleId],
          isLoading: true,
          error: null
        },
      },
    }));

    try {
      const response = await axios.get(`${API_URL}/leaderboards/riddles/${riddleId}`, {
        params: { limit, offset },
      });
      const data = response.data;
      console.log("datas", data);

      set((state) => ({
        riddleLeaderboard: {
          ...state.riddleLeaderboard,
          [riddleId]: {
            list: (offset === 0) ? data.ranking : [...state.riddleLeaderboard[riddleId].list, ...data.ranking],
            userRank: data.userRank || null,
            offset: offset + data.ranking?.length,
            isLoading: false,
            error: null,
            hasMore: data.ranking?.length === limit,
          },
        },
      }));

    } catch (error) {
      const axiosError = error as AxiosError<any>;
      console.error(`Erreur fetch leaderboard pour riddle ${riddleId}:`, axiosError.response?.data || axiosError.message);
      const message = axiosError.response?.data?.message || 'Erreur de chargement du classement';

      set((state) => ({
        riddleLeaderboard: {
          ...state.riddleLeaderboard,
          [riddleId]: {
            ...state.riddleLeaderboard[riddleId],
            isLoading: false,
            error: message,
          },
        },
      }));
    }
  },

  clearRiddleLeaderboard: (riddleId: string) => {
     set((state) => {
       const newriddleLeaderboard = { ...state.riddleLeaderboard };
       delete newriddleLeaderboard[riddleId];
       return { riddleLeaderboard: newriddleLeaderboard };
     });
  },

  clearGlobalLeaderboard: () => {
    set((state) => ({
      globalLeaderboard: {
        ...state.globalLeaderboard,
        week: { ...defaultGlobalLeaderboard },
        month: { ...defaultGlobalLeaderboard },
        all: { ...defaultGlobalLeaderboard },
      }
    }));
  },

  clearGlobalLeaderboardPeriod: (period: 'week' | 'month' | 'all') => {
    set((state) => ({
      globalLeaderboard: {
        ...state.globalLeaderboard,
        [period]: { ...defaultGlobalLeaderboard }
      }
    }));
  },
}));
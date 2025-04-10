import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface SessionStep {
  id: number;
  game_session_id: number;
  step_id: number;
  hint_used_number: number; 
  status: 'active' | 'completed' | 'abandoned';
  start_time: string;
  end_time: string | null;
}

export interface Game {
  id: number;
  riddle_id: number;
  player_id: number;
  status: 'active' | 'completed' | 'abandoned';
  score: number;
  created_at: string;
  updated_at: string;
  sessionSteps: SessionStep[];
}

export interface Ranking {
  name: string;
  image: string;
  score: number;
}

export interface GameList {
  id: number;
  riddle_id: number;
  player_id: number;
  status: 'active' | 'completed' | 'abandoned';
  score: number;
  created_at: string;
  updated_at: string;
}

export interface GameSessionState {
  participatedList: {
    games: GameList[] | null;
    offset: number;
    isLoading: boolean;
    error: string | null;
  }
  riddleRanking: {
    ranking: Ranking[] | null;
    offset: number;
    isLoading: boolean;
    error: string | null;
  }
  gameSession: {
    game: Game | null;
    isLoading: boolean;
    error: string | null;
  }
  fetchParticipatedList: (params?: { limit?: number; offset?: number }) => Promise<void>;
  fetchRiddleRanking: (riddleId: number, params?: { limit?: number; offset?: number }) => Promise<void>;
  fetchGameSession: (userId: number) => Promise<void>;
}

export const useGameSessionStore = create<GameSessionState>((set) => ({
  participatedList: {
    games: [],
    offset: 0,
    isLoading: false,
    error: null,
  },
  riddleRanking: {
    ranking: [],
    offset: 0,
    isLoading: false,
    error: null,
  },
  gameSession: {
    game: null,
    isLoading: false,
    error: null,
  },

  fetchParticipatedList: async ({ limit = 20, offset } = {}) => {
    const currentOffset = offset !== undefined ? offset : get().participatedList.offset;
    set((state) => ({
      participatedList: { ...state.participatedList, isLoading: true, error: null },
    }));

    try {
      const response = await axios.get(`${API_URL}/game-sessions`, {
        params: { limit, offset: currentOffset },
      });
      const data = response.data; // on s'attend à recevoir { games: [...] }
      set((state) => ({
        participatedList: {
          ...state.participatedList,
          games: currentOffset === 0 ? data.games : [...state.participatedList.games, ...data.games],
          offset: state.participatedList.offset + data.games.length,
        },
      }));

    } catch (error: any) {
      console.error('Erreur lors du fetch de la liste des parties participées:', error);
      set((state) => ({
        participatedList: {
          ...state.participatedList,
          error: error.response?.data?.message || 'Erreur lors du chargement des parties participées',
        },
      }));

    } finally {
      set((state) => ({
        participatedList: { ...state.participatedList, isLoading: false },
      }));
    }
  },

  fetchRiddleRanking: async (riddleId: number, { limit = 20, offset = 0 } = {}) => {
    set((state) => ({
      riddleRanking: { ...state.riddleRanking, isLoading: true, error: null },
    }));

    try {
      const response = await axios.get(`${API_URL}/leaderboard/riddle/${riddleId}`, {
        params: { limit, offset },
      });
      const data = response.data; // on s'attend à recevoir { ranking: [...] }
      set((state) => ({
        riddleRanking: {
          ...state.riddleRanking,
          ranking: offset === 0 ? data.ranking : [...state.riddleRanking.ranking, ...data.ranking],
          offset: state.riddleRanking.offset + data.ranking.length,
        },
      }));

    } catch (error: any) {
      console.error('Erreur lors du fetch du classement du riddle:', error);
      set((state) => ({
        riddleRanking: {
          ...state.riddleRanking,
          error: error.response?.data?.message || 'Erreur lors du chargement du classement du riddle',
        },
      }));

    } finally {
      set((state) => ({
        riddleRanking: { ...state.riddleRanking, isLoading: false },
      }));
    }
  },

  fetchGameSession: async (userId: number) => {
    set((state) => ({
      gameSession: { ...state.gameSession, isLoading: true, error: null },
    }));

    try {
      const response = await axios.get(`${API_URL}/game-sessions/active`, {
        params: { userId }
      });
      const data = response.data; // On s'attend à recevoir la game session avec ses relations préchargées
      set((state) => ({
        gameSession: { ...state.gameSession, game: data },
      }));

    } catch (error: any) {
      console.error('Erreur lors du fetch de la game session:', error);
      set((state) => ({
        gameSession: {
          ...state.gameSession,
          error: error.response?.data?.message || 'Erreur lors du chargement de la game session',
        },
      }));
      
    } finally {
      set((state) => ({
        gameSession: { ...state.gameSession, isLoading: false },
      }));
    }
  },

}));
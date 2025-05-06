import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

export interface RiddleState {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
}

export interface PlayedListItem extends GameSession {
  riddle: RiddleState;
}

export interface GameSession {
  id: number;
  riddle_id: number;
  player_id: number;
  status: 'active' | 'completed' | 'abandoned';
  score: number;
  created_at: string;
  updated_at: string;
}

export interface riddleGameSession {
  session: GameSession | null;
  isLoading: boolean;
  error: string | null;
}

export interface PlayedList {
  sessions: PlayedListItem[];
  offset: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface GameSessionState {
  playedList: PlayedList;
  riddleGameSession: riddleGameSession;

  fetchPlayedList: (params?: { limit?: number; offset?: number; refresh?: boolean }) => Promise<void>;
  fetchGameSessionByRiddleAndUser: (riddleId: string, userId: number) => Promise<void>;
}


// --- Store ---

export const useGameSessionStore = create<GameSessionState>((set, get) => ({
  playedList: {
    sessions: [],
    offset: 0,
    hasMore: true,
    isLoading: false,
    error: null,
  },
  riddleGameSession: {
    session: null,
    isLoading: false,
    error: null,
  },

  // --- Fetch liste des sessions jouées (GET /users/me/game-sessions) ---
  fetchPlayedList: async ({ limit = 20, offset, refresh = false } = {}) => {
    const currentState = get().playedList;
    const currentOffset = refresh ? 0 : offset ?? currentState.offset;

    if (currentState.isLoading || (!currentState.hasMore && !refresh)) {
      return;
    }

    set((state) => ({ 
      playedList: { ...state.playedList, isLoading: true, error: null },
    }));

    try {
      const response = await axios.get<{ sessions: PlayedListItem[]; meta: { total: number, hasMore: boolean } }>(`${API_URL}/users/me/game-sessions`, {
        params: { limit, offset: currentOffset }
      });
      const { sessions, meta } = response.data;
      console.log("FETCH PLAYED LIST", response.data)

      set((state) => {
        const existingSessions = state.playedList.sessions;
        const newSessions = refresh || currentOffset === 0 ? sessions : [...existingSessions, ...sessions];
        const uniqueSessions = Array.from(new Map(newSessions.map(s => [s.id, s])).values());

        return {
          playedList: {
            sessions: uniqueSessions,
            offset: currentOffset + sessions.length,
            isLoading: false,
            error: null,
            hasMore: meta.hasMore ?? (sessions.length === limit),
          }
        };
      });

    } catch (error: any) {
      console.error("Erreur fetchPlayedList:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur chargement des parties jouées";
      set((state) => ({
        playedList: { ...state.playedList, isLoading: false, error: message }
      }));
    }
  },

   // --- Fetch une session pour un riddle le user connecté (GET /riddles/{riddleId}/my-session) ---
  fetchGameSessionByRiddleAndUser: async (riddleId: string, userId: number) => {
    set((state) => ({
      riddleGameSession: { ...state.riddleGameSession, isLoading: true, error: null },
    }));

    try {
      const response = await axios.get(`${API_URL}/riddles/${riddleId}/my-session`);
      console.log("FETCH GAME SESSION BY RIDDLE AND USER", response.data)

      set({
        riddleGameSession: { session: response.data, isLoading: false, error: null },
      });

    } catch (error: any) {
      console.error('Erreur fetchGameSessionByRiddleAndUser:', error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur chargement de la partie jouée pour cette énigme";
      set({
        riddleGameSession: { session: null, isLoading: false, error: message },
      });
    }
  },

}));
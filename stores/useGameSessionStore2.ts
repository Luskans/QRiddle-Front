import { create } from 'zustand';
import axios from 'axios';
import { isLoading } from 'expo-font';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

export interface Hint {
  id : number;
  type: 'text' | 'image' | 'audio';
  content: string;
}

export interface SessionStep {
  id: number;
  game_session_id: number;
  // step_id: number;
  // hint_used_number: number;
  status: 'active' | 'completed' | 'abandoned';
  start_time: string;
  end_time: string;
  // created_at: string;
  // updated_at: string;
}

export interface SessionByRiddle extends Session {
  session_steps: SessionStep[];
}

export interface PlayedListItem extends Session {
  riddle_id: number;
  created_at: string;
  riddle: {
    id: number;
    title: string;
    latitude: string;
    longitude: string;
  }
}

export interface Session {
  id: number;
  riddle_id: number;
  player_id: number;
  status: 'active' | 'completed' | 'abandoned';
  // score: number;
  // created_at: string;
  // updated_at: string;
  // session_steps: SessionStep[];
}

export interface ActiveGameSession {
  session: Session | null;
  currentSessionStep: {
    id: number;
    start_time: string;
    step: {
      id: number;
      order_number: number;
    }
  } | null;
  hints: Hint[] | [];
  isLoading: boolean;
  error: string | null;
}

export interface GameSessionByRiddle {
  session: SessionByRiddle | null;
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

export interface GameSessionStore {
  playedList: PlayedList;
  gameSessionByRiddle: {
    [riddleId: string]: GameSessionByRiddle
  };
  activeGameSession: ActiveGameSession;
 

  fetchPlayedList: (params?: { limit?: number; offset?: number; refresh?: boolean }) => Promise<void>;
  fetchGameSessionByRiddle: (riddleId: string) => Promise<void>;
  fetchActiveGameSession: (id: string) => Promise<void>;
  createGame: (riddle_id: string, password: string) => Promise<Session | null>;
}

export const defaultGameSessionByRiddleState: GameSessionByRiddle = {
  session: null,
  isLoading: false,
  error: null,
};


// --- Store ---

export const useGameSessionStore = create<GameSessionStore>((set, get) => ({
  playedList: {
    sessions: [],
    offset: 0,
    hasMore: true,
    isLoading: false,
    error: null,
  },
  gameSessionByRiddle: {},
  activeGameSession: {
    session: null,
    currentSessionStep: null,
    hints: [],
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

  // --- Fetch une session pour un riddle et le user connecté (GET /riddles/{riddleId}/my-session) ---
  fetchGameSessionByRiddle: async (riddleId: string) => {
    const currentState = get().gameSessionByRiddle[riddleId] ?? defaultGameSessionByRiddleState;
    
    if (currentState.isLoading) {
      return;
    }

    set((state) => ({    
      gameSessionByRiddle: {
        ...state.gameSessionByRiddle,
        [riddleId]: { 
          ...currentState,
          isLoading: true,
          error: null 
        },
      },
    }));

    try {
      const response = await axios.get(`${API_URL}/riddles/${riddleId}/my-session`);
      const data = response.data;
      console.log("FETCH GAME SESSION BY RIDDLE", response.data)

      set((state) => ({
        gameSessionByRiddle: {
          ...state.gameSessionByRiddle,
          [riddleId]: {
            session: data.session,
            isLoading: false,
            error: null,
          },
        },
      }));

    } catch (error: any) {
      console.error('Erreur fetchGameSessionByRiddle:', error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur chargement de la partie jouée pour cette énigme";
      set(state => ({
        gameSessionByRiddle: {
          ...state.gameSessionByRiddle,
          [riddleId]: {
            ...currentState,
            isLoading: false,
            error: message,
          }
        }
      }));
    }
  },

  // --- Fetch une partie en cours (GET /game-sessions/{game_session}) ---
  fetchActiveGameSession: async (id: string) => {
    const currentState = get().activeGameSession;
    
    if (currentState.isLoading) {
      return;
    }

    set((state) => ({    
      activeGameSession: {
        ...currentState,
        isLoading: true,
        error: null 
      },
    }));

    try {
      const response = await axios.get(`${API_URL}/game-sessions/${id}`);
      const data = response.data;
      console.log("FETCH ACTIVE GAME", response.data)

      set((state) => ({
        activeGameSession: {
          ...state.activeGameSession,
          session: data.session,
          currentSessionStep: data.currentSessionStep,
          hints: data.hints,
          isLoading: false,
        },
      }));

    } catch (error: any) {
      console.error('Erreur fetchActiveGameSession:', error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur chargement de la partie";
      set(state => ({
        activeGameSession: {
          ...currentState,
          isLoading: false,
          error: message,
        },
      }));
    }
  },

  // --- Création d'une partie (POST /game-sessions) ---
  createGame: async (riddle_id: string, password: string): Promise<Session | null> => {
    // const currentState = get().activeGameSession;
    
    // set((state) => ({    
    //   activeGameSession: {
    //     ...currentState,
    //     isLoading: true,
    //     error: null 
    //   },
    // }));

    try {
      console.log('riddleid et passowrd', riddle_id)
      console.log('riddleid et passowrd2', password)
      const response = await axios.post(`${API_URL}/game-sessions`, {riddle_id, password});
      const newGame = response.data;
      console.log("START GAME", response.data);

      // set({
      //   // update le game session pour un riddle
      //   activeGameSession: {
      //     session: newGame,
      //     isLoading: false,
      //     error: null 
      //   },
      // });

      return newGame;

    } catch (error: any) {
      console.error("Erreur startGame:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Impossible de démarrer la partie";
      // set({
      //   // update le game session pour un riddle
      //   activeGameSession: {
      //     ...currentState,
      //     isLoading: false,
      //     error: message ,
      //   },
      // });

      return null;
    }
  },

}));
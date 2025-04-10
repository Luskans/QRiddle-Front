// stores/useGameSessionStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { Riddle } from './useRiddleStore'; // Importer si besoin d'infos Riddle
import { Step } from './useStepStore'; // Importer si besoin d'infos Step
import { Hint } from './useHintStore'; // Importer si besoin d'infos Hint

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

// État d'une étape dans une session de jeu
export interface SessionStepInfo extends SessionStep { // Hérite de ton modèle SessionStep
  step?: Step; // Inclure les détails de l'étape de base (lat/lon, etc.) via eager loading
}

// État d'une session de jeu (pour la liste et le jeu en cours)
export interface GameSessionInfo extends GameSession { // Hérite de ton modèle GameSession
  riddle?: Pick<Riddle, 'id' | 'title'>; // Inclure des infos de base sur l'énigme
  // player?: Pick<User, 'id' | 'name'>; // Inclus si nécessaire pour la liste 'played'
}

// État spécifique au jeu en cours
interface CurrentGameState {
  session: GameSessionInfo | null;
  currentStep: SessionStepInfo | null; // L'étape que le joueur doit actuellement résoudre
  availableHints: Hint[]; // Les indices disponibles pour l'étape actuelle
  isLoading: boolean;
  error: string | null;
  isValidating: boolean; // État spécifique pour la validation du QR code
}

// État pour la liste des parties jouées
interface PlayedSessionsState {
  sessions: GameSessionInfo[];
  offset: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

// État global du store
export interface GameSessionState {
  currentGame: CurrentGameState;
  playedSessions: PlayedSessionsState;

  // --- Actions ---
  fetchCurrentGame: () => Promise<void>; // Trouve la session 'in_progress'
  fetchPlayedSessions: (params?: { limit?: number; offset?: number; refresh?: boolean }) => Promise<void>;
  startGameSession: (riddleId: string) => Promise<GameSessionInfo | null>; // Démarre une nouvelle partie
  validateStep: (sessionId: number, qrCodeValue: string) => Promise<{ success: boolean; message?: string; isGameComplete?: boolean }>; // Valide le QR code
  useHint: (sessionId: number, stepId: number) => Promise<Hint | null>; // Demande/utilise un indice
  abandonCurrentGame: () => Promise<void>; // Abandonne la partie en cours
  clearCurrentGame: () => void; // Nettoie l'état du jeu en cours (ex: logout)
  clearPlayedSessions: () => void; // Nettoie la liste des parties jouées
}

// --- État Initial ---
const initialCurrentGameState: CurrentGameState = {
  session: null,
  currentStep: null,
  availableHints: [],
  isLoading: false,
  error: null,
  isValidating: false,
};

const initialPlayedSessionsState: PlayedSessionsState = {
  sessions: [],
  offset: 0,
  hasMore: true,
  isLoading: false,
  error: null,
};

// --- Store Implementation ---
export const useGameSessionStore = create<GameSessionState>((set, get) => ({
  currentGame: initialCurrentGameState,
  playedSessions: initialPlayedSessionsState,

  // --- Actions ---

  fetchCurrentGame: async () => {
    set(state => ({ currentGame: { ...state.currentGame, isLoading: true, error: null } }));
    try {
      // Hypothèse: Le backend renvoie la session 'in_progress' et ses détails (étape actuelle, indices)
      // Alternative: Un endpoint dédié GET /game-sessions/current
      const response = await axios.get<{ session: GameSessionInfo | null; currentStep: SessionStepInfo | null; hints: Hint[] }>(
        `${API_URL}/users/me/game-sessions?status=in_progress&limit=1&with=riddle,currentStep.step,currentStepHints` // Exemple d'URL avec query params
      );

      const { session, currentStep, hints } = response.data; // Ajuster selon la réponse réelle

      set({
        currentGame: {
          session: session,
          currentStep: currentStep,
          availableHints: hints || [],
          isLoading: false,
          error: null,
          isValidating: false,
        }
      });

    } catch (error: any) {
      // Si 404, signifie probablement pas de partie en cours, ce n'est pas une erreur bloquante
      if (error.response?.status === 404) {
         set({ currentGame: { ...initialCurrentGameState, isLoading: false } });
      } else {
         console.error("Erreur fetchCurrentGame:", error.response?.data || error.message);
         const message = error.response?.data?.message || "Erreur chargement partie en cours";
         set(state => ({ currentGame: { ...state.currentGame, isLoading: false, error: message } }));
      }
    }
  },

  fetchPlayedSessions: async ({ limit = 15, offset, refresh = false } = {}) => {
    const currentState = get().playedSessions;
    const currentOffset = refresh ? 0 : offset ?? currentState.offset;

    if (currentState.isLoading || (!currentState.hasMore && !refresh)) {
      return;
    }

    set(state => ({ playedSessions: { ...state.playedSessions, isLoading: true, error: null } }));

    try {
      // Récupère les sessions (terminées, abandonnées?) de l'utilisateur
      const response = await axios.get<{ sessions: GameSessionInfo[]; meta: { hasMore: boolean } }>(
        `${API_URL}/users/me/game-sessions`, // Le backend filtre par défaut ou via ?status=completed,abandoned
        { params: { limit, offset: currentOffset, with: 'riddle' } } // Charger les infos du riddle
      );
      const { sessions, meta } = response.data;

      set(state => {
        const existingSessions = state.playedSessions.sessions;
        const newSessions = refresh || currentOffset === 0 ? sessions : [...existingSessions, ...sessions];
        const uniqueSessions = Array.from(new Map(newSessions.map(s => [s.id, s])).values());

        return {
          playedSessions: {
            sessions: uniqueSessions,
            offset: currentOffset + sessions.length,
            hasMore: meta.hasMore ?? (sessions.length === limit),
            isLoading: false,
            error: null,
          }
        };
      });

    } catch (error: any) {
      console.error("Erreur fetchPlayedSessions:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur chargement historique";
      set(state => ({ playedSessions: { ...state.playedSessions, isLoading: false, error: message } }));
    }
  },

  startGameSession: async (riddleId: string): Promise<GameSessionInfo | null> => {
    // Vérifier si une partie est déjà en cours avant d'en lancer une nouvelle ?
    if (get().currentGame.session) {
       console.warn("Une partie est déjà en cours.");
       // Peut-être retourner la session existante ou une erreur spécifique
       return get().currentGame.session;
       // throw new Error("Une partie est déjà en cours. Terminez-la ou abandonnez-la d'abord.");
    }

    set(state => ({ currentGame: { ...state.currentGame, isLoading: true, error: null } }));
    try {
      // Le backend crée la session, la première SessionStep, et retourne les infos nécessaires
      const response = await axios.post<{ session: GameSessionInfo; currentStep: SessionStepInfo; hints: Hint[] }>(
        `${API_URL}/game-sessions`,
        { riddle_id: riddleId }
      );
      const { session, currentStep, hints } = response.data;

      set({
        currentGame: {
          session: session,
          currentStep: currentStep,
          availableHints: hints || [],
          isLoading: false,
          error: null,
          isValidating: false,
        }
      });
      return session;

    } catch (error: any) {
      console.error("Erreur startGameSession:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Impossible de démarrer la partie";
      set(state => ({ currentGame: { ...state.currentGame, isLoading: false, error: message } }));
      return null;
    }
  },

  validateStep: async (sessionId: number, qrCodeValue: string): Promise<{ success: boolean; message?: string; isGameComplete?: boolean }> => {
    if (get().currentGame.isValidating) return { success: false, message: "Validation déjà en cours." }; // Éviter double validation

    set(state => ({ currentGame: { ...state.currentGame, isValidating: true, error: null } }));
    try {
      // Le backend valide le QR code, met à jour SessionStep, calcule score si fin, retourne le nouvel état
      const response = await axios.post<{
        message: string;
        updatedSession?: GameSessionInfo; // Session mise à jour si terminée
        nextStep?: SessionStepInfo; // Prochaine étape
        nextHints?: Hint[]; // Indices pour la prochaine étape
        isGameComplete: boolean;
      }>(
        `${API_URL}/game-sessions/${sessionId}/steps/validate`,
        { qr_code: qrCodeValue }
      );

      const { message, updatedSession, nextStep, nextHints, isGameComplete } = response.data;

      set(state => ({
        currentGame: {
          ...state.currentGame,
          // Mettre à jour la session si elle a changé (ex: statut, score)
          session: updatedSession || state.currentGame.session,
          // Mettre à jour l'étape actuelle avec la suivante (ou null si fini)
          currentStep: nextStep || null,
          // Mettre à jour les indices disponibles
          availableHints: nextHints || [],
          isValidating: false,
          error: null, // Succès, on nettoie les erreurs précédentes
        }
      }));

      // Rafraîchir la liste des parties jouées si le jeu est terminé
      if (isGameComplete) {
         get().fetchPlayedSessions({ refresh: true });
      }

      return { success: true, message, isGameComplete };

    } catch (error: any) {
      console.error("Erreur validateStep:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Code QR invalide ou erreur serveur";
      set(state => ({ currentGame: { ...state.currentGame, isValidating: false, error: message } }));
      return { success: false, message };
    }
  },

  useHint: async (sessionId: number, stepId: number): Promise<Hint | null> => {
    // Note: On pourrait ajouter un état isLoadingHint
    try {
      // Le backend enregistre l'utilisation, retourne l'indice révélé et met à jour hint_used_number
      const response = await axios.post<{ hint: Hint; updatedSessionStep: SessionStepInfo }>(
        `${API_URL}/game-sessions/${sessionId}/steps/${stepId}/hints/use`
      );
      const { hint, updatedSessionStep } = response.data;

      set(state => {
         // Mettre à jour le currentStep avec les infos à jour (hint_used_number)
         const newCurrentStep = state.currentGame.currentStep?.id === updatedSessionStep.id
            ? updatedSessionStep
            : state.currentGame.currentStep;

         // Ajouter l'indice révélé à la liste (si pas déjà présent)
         const hintAlreadyAvailable = state.currentGame.availableHints.some(h => h.id === hint.id);
         const newAvailableHints = hintAlreadyAvailable
            ? state.currentGame.availableHints
            : [...state.currentGame.availableHints, hint].sort((a, b) => a.order_number - b.order_number);

         return {
           currentGame: {
             ...state.currentGame,
             currentStep: newCurrentStep,
             availableHints: newAvailableHints,
             error: null, // Nettoyer erreur si succès
           }
         };
      });
      return hint;

    } catch (error: any) {
      console.error("Erreur useHint:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Impossible d'obtenir l'indice";
      set(state => ({ currentGame: { ...state.currentGame, error: message } }));
      return null;
    }
  },

  abandonCurrentGame: async () => {
    const sessionId = get().currentGame.session?.id;
    if (!sessionId) return;

    set(state => ({ currentGame: { ...state.currentGame, isLoading: true } })); // Utiliser isLoading pour l'abandon
    try {
      // Option 1: Mettre à jour le statut
      await axios.put(`${API_URL}/game-sessions/${sessionId}`, { status: 'abandoned' });
      // Option 2: Supprimer la session ? (Moins bon pour l'historique)
      // await axios.delete(`${API_URL}/game-sessions/${sessionId}`);

      set({ currentGame: initialCurrentGameState }); // Réinitialiser l'état du jeu en cours
      // Rafraîchir la liste des parties jouées pour inclure celle abandonnée
      get().fetchPlayedSessions({ refresh: true });

    } catch (error: any) {
      console.error("Erreur abandonCurrentGame:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Impossible d'abandonner la partie";
      set(state => ({ currentGame: { ...state.currentGame, isLoading: false, error: message } }));
    }
  },

  clearCurrentGame: () => {
    set({ currentGame: initialCurrentGameState });
  },

  clearPlayedSessions: () => {
     set({ playedSessions: initialPlayedSessionsState });
  }

}));
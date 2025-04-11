// stores/useGameSessionStore.ts
import { create } from 'zustand';
import axios from 'axios';
import { Riddle } from './useRiddleStore'; // Importer si besoin d'infos Riddle
import { Step } from './useStepStore'; // Importer si besoin d'infos Step
import { Hint } from './useHintStore'; // Importer si besoin d'infos Hint
// Optionnel: Importer User si tu l'utilises dans GameSessionInfo
// import { User } from './useAuthStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

// Interface de base pour GameSession (basée sur app/Models/GameSession.php)
export interface GameSession {
  id: number;
  riddle_id: number;
  player_id: number;
  status: 'active' | 'completed' | 'abandoned'; // Correspond à l'enum backend
  score: number;
  created_at: string; // Format ISO 8601 string
  updated_at: string; // Format ISO 8601 string
}

// Interface de base pour SessionStep (basée sur app/Models/SessionStep.php)
export interface SessionStep {
  id: number;
  game_session_id: number;
  step_id: number;
  hint_used_number: number;
  status: 'active' | 'completed' | 'abandoned'; // Assure-toi que ces statuts sont corrects
  start_time: string; // Format ISO 8601 string
  end_time: string | null; // Peut être null si l'étape n'est pas finie
  created_at: string; // Format ISO 8601 string
  updated_at: string; // Format ISO 8601 string
}

// --- Interfaces étendues (utilisées dans le store) ---

// État d'une étape dans une session de jeu (hérite de SessionStep)
export interface SessionStepInfo extends SessionStep {
  // Inclure les détails de l'étape de base (lat/lon, etc.) si chargés par le backend
  step?: Step;
}

// État d'une session de jeu (hérite de GameSession)
export interface GameSessionInfo extends GameSession {
  // Inclure des infos de base sur l'énigme si chargées par le backend
  riddle?: Pick<Riddle, 'id' | 'title'>; // Ou plus de champs si nécessaire
  // Inclure des infos sur le joueur si nécessaire (pour la liste 'played')
  // player?: Pick<User, 'id' | 'name' | 'image'>;
}

// --- Définitions des états du store ---

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
  fetchCurrentGame: () => Promise<void>; // Trouve la session 'active' (ou 'in_progress')
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
      // Utilise la route /users/me/game-sessions avec le filtre status=active
      // Assure-toi que le backend utilise 'active' comme statut pour "en cours"
      const response = await axios.get<{ sessions: GameSessionInfo[] }>( // L'API retourne un tableau même si on limite à 1
        `${API_URL}/users/me/game-sessions`,
        {
          params: {
            status: 'active', // **Vérifie ce statut**
            limit: 1,
            // Eager load les relations nécessaires pour l'affichage du jeu
            with: 'riddle:id,title,description,status', // Infos énigme
                  // 'currentStep' n'est pas une relation directe, mais on peut charger la dernière étape active
                  // Le backend doit gérer la logique pour retourner l'étape active et ses indices
                  // Exemple: 'activeSessionStep.step', 'activeSessionStep.hints'
                  // Ou le backend peut retourner des clés dédiées 'currentStep' et 'availableHints'
          }
        }
      );

      // Le backend devrait retourner un tableau 'sessions'. On prend le premier élément s'il existe.
      const activeSession = response.data.sessions?.[0] || null;

      // Hypothèse: Le backend ajoute 'currentStep' et 'availableHints' à l'objet session retourné
      // Si ce n'est pas le cas, il faudra adapter la réponse backend ou faire des appels séparés
      const currentStep = (activeSession as any)?.currentStep || null; // Cast temporaire si la structure n'est pas garantie
      const hints = (activeSession as any)?.availableHints || [];

      set({
        currentGame: {
          session: activeSession,
          currentStep: currentStep,
          availableHints: hints,
          isLoading: false,
          error: null,
          isValidating: false,
        }
      });

    } catch (error: any) {
      // Si 404 sur /users/me/game-sessions, cela peut être une erreur serveur, pas juste "pas de partie"
      // Une réponse vide (tableau sessions vide) est le cas normal pour "pas de partie en cours"
      console.error("Erreur fetchCurrentGame:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur chargement partie en cours";
      set(state => ({ currentGame: { ...initialCurrentGameState, isLoading: false, error: message } }));
      // Si l'erreur est 401 (non authentifié), le store d'auth devrait gérer la déconnexion
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
      // Récupère les sessions terminées ou abandonnées
      const response = await axios.get<{ sessions: GameSessionInfo[]; meta: { hasMore: boolean } }>(
        `${API_URL}/users/me/game-sessions`,
        { params: {
            status: 'completed,abandoned', // Filtre par statuts multiples
            limit,
            offset: currentOffset,
            with: 'riddle:id,title' // Charger les infos de base du riddle
          }
        }
      );
      const { sessions, meta } = response.data;

      set(state => {
        const existingSessions = state.playedSessions.sessions;
        // Utiliser l'ID de session pour le dédoublonnage
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
    if (get().currentGame.session) {
       console.warn("Une partie est déjà en cours.");
       return get().currentGame.session;
    }

    set(state => ({ currentGame: { ...state.currentGame, isLoading: true, error: null } }));
    try {
      // POST /game-sessions pour démarrer
      // Le backend crée GameSession, le premier SessionStep (status=active), et retourne les infos
      const response = await axios.post<{
          session: GameSessionInfo;
          currentStep: SessionStepInfo; // Le premier SessionStep créé
          availableHints: Hint[]; // Les indices pour la première étape
        }>(
        `${API_URL}/game-sessions`,
        { riddle_id: riddleId } // Envoyer l'ID de l'énigme à démarrer
      );
      const { session, currentStep, availableHints } = response.data;

      set({
        currentGame: {
          session: session,
          currentStep: currentStep,
          availableHints: availableHints || [],
          isLoading: false,
          error: null,
          isValidating: false,
        }
      });
      return session;

    } catch (error: any) {
      console.error("Erreur startGameSession:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Impossible de démarrer la partie";
      set(state => ({ currentGame: { ...initialCurrentGameState, isLoading: false, error: message } })); // Reset si erreur
      return null;
    }
  },

  validateStep: async (sessionId: number, qrCodeValue: string): Promise<{ success: boolean; message?: string; isGameComplete?: boolean }> => {
    if (get().currentGame.isValidating) return { success: false, message: "Validation déjà en cours." };

    set(state => ({ currentGame: { ...state.currentGame, isValidating: true, error: null } }));
    try {
      // POST /game-sessions/{sessionId}/steps/validate
      // Le backend valide le QR code pour l'étape attendue, met à jour SessionStep (end_time, status),
      // crée le prochain SessionStep si applicable, calcule le score final si c'est la dernière étape,
      // et retourne le nouvel état du jeu.
      const response = await axios.post<{
        message: string;
        updatedSession?: GameSessionInfo; // Session mise à jour (statut, score) si finie
        nextStep?: SessionStepInfo | null; // Prochain SessionStep (ou null si fini)
        nextHints?: Hint[]; // Indices pour la prochaine étape
        isGameComplete: boolean; // Booléen indiquant si le jeu est terminé
      }>(
        `${API_URL}/game-sessions/${sessionId}/steps/validate`,
        { qr_code: qrCodeValue } // Envoyer la valeur scannée
      );

      const { message, updatedSession, nextStep, nextHints, isGameComplete } = response.data;

      set(state => ({
        currentGame: {
          ...state.currentGame,
          session: updatedSession || state.currentGame.session, // Mettre à jour si la session a changé
          currentStep: nextStep, // Mettre à jour l'étape actuelle (peut devenir null)
          availableHints: nextHints || [], // Mettre à jour les indices
          isValidating: false,
          error: null,
        }
      }));

      // Rafraîchir la liste des parties jouées si le jeu est terminé
      if (isGameComplete) {
         get().fetchPlayedSessions({ refresh: true });
      }

      return { success: true, message, isGameComplete };

    } catch (error: any) {
      console.error("Erreur validateStep:", error.response?.data || error.message);
      // Le backend devrait retourner 4xx si le code QR est invalide
      const message = error.response?.data?.message || "Code QR invalide ou erreur serveur";
      set(state => ({ currentGame: { ...state.currentGame, isValidating: false, error: message } }));
      return { success: false, message };
    }
  },

  useHint: async (sessionId: number, stepId: number): Promise<Hint | null> => {
    // Note: stepId ici est l'ID de l'étape de base (Step), pas SessionStep.id
    // L'URL backend doit correspondre à cette logique.
    try {
      // POST /game-sessions/{sessionId}/steps/{stepId}/hints/use
      // Le backend trouve le SessionStep actif pour ce Step dans cette session,
      // incrémente hint_used_number, et retourne l'indice suivant disponible.
      const response = await axios.post<{
          hint: Hint; // L'indice révélé
          updatedSessionStep: SessionStepInfo; // Le SessionStep mis à jour (avec hint_used_number)
        }>(
        `${API_URL}/game-sessions/${sessionId}/steps/${stepId}/hints/use`
      );
      const { hint, updatedSessionStep } = response.data;

      set(state => {
         // Mettre à jour le currentStep avec les infos à jour (hint_used_number)
         // Vérifier si le updatedSessionStep correspond bien à l'étape actuelle affichée
         const newCurrentStep = state.currentGame.currentStep?.id === updatedSessionStep.id
            ? updatedSessionStep
            : state.currentGame.currentStep;

         // Ajouter l'indice révélé à la liste des indices disponibles pour l'UI
         const hintAlreadyAvailable = state.currentGame.availableHints.some(h => h.id === hint.id);
         const newAvailableHints = hintAlreadyAvailable
            ? state.currentGame.availableHints
            : [...state.currentGame.availableHints, hint].sort((a, b) => a.order_number - b.order_number);

         return {
           currentGame: {
             ...state.currentGame,
             currentStep: newCurrentStep,
             availableHints: newAvailableHints,
             error: null,
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

    set(state => ({ currentGame: { ...state.currentGame, isLoading: true } }));
    try {
      // PUT /game-sessions/{sessionId} pour changer le statut
      await axios.put(`${API_URL}/game-sessions/${sessionId}`, { status: 'abandoned' });

      set({ currentGame: initialCurrentGameState }); // Réinitialiser l'état du jeu en cours
      get().fetchPlayedSessions({ refresh: true }); // Rafraîchir l'historique

    } catch (error: any) {
      console.error("Erreur abandonCurrentGame:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Impossible d'abandonner la partie";
      // Garder l'état isLoading à false même en cas d'erreur ?
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
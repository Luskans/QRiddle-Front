import { create } from 'zustand';
import axios, { AxiosError } from 'axios'; // Import AxiosError pour un meilleur typage d'erreur
import { User } from './useAuthStore'; // Assurez-vous que ce chemin est correct et exporte l'interface User

// Récupérer l'URL de base de l'API depuis les variables d'environnement
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

// Interface pour une entrée du classement d'énigme (basée sur GameSession + Player)
export interface RiddleLeaderboardEntry {
  id: number; // ID de GameSession
  score: number;
  player_id: number;
  updated_at: string; // Date/heure de complétion de la session
  player: Pick<User, 'id' | 'name' | 'image'>; // Informations essentielles du joueur
}

// Interface pour une entrée du classement global (basée sur GlobalScore + User)
export interface GlobalLeaderboardEntry {
  score: number;
  // Directement depuis la jointure dans ScoreService
  name: string;
  image: string | null;
  // user_id?: number; // Peut être utile pour l'identification
}

// Interface pour le rang de l'utilisateur (utilisée pour global et par énigme)
export interface UserRank {
  score: number;
  rank: number;
}

// État spécifique pour le classement d'une énigme
interface RiddleLeaderboardState {
  list: RiddleLeaderboardEntry[];
  userRank: UserRank | null;
  offset: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

// État global du store
export interface LeaderboardState {
  // Classements globaux
  globalRankings: {
    week: GlobalLeaderboardEntry[];
    month: GlobalLeaderboardEntry[];
    all: GlobalLeaderboardEntry[];
  };
  globalUserRanks: {
    week: UserRank | null;
    month: UserRank | null;
    all: UserRank | null;
  };
  globalIsLoading: boolean;
  globalError: string | null;

  // Classements par énigme (dictionnaire)
  riddleLeaderboards: {
    [riddleId: string]: RiddleLeaderboardState;
  };

  // --- Actions ---

  // Fonctions pour le classement global
  fetchGlobalRankings: (params?: { limit?: number }) => Promise<void>; // Simplifié sans offset pour l'instant
  fetchGlobalUserRank: () => Promise<void>;

  // Fonctions pour le classement par énigme
  fetchRiddleLeaderboard: (riddleId: string, params?: { limit?: number; offset?: number; refresh?: boolean }) => Promise<void>;
  clearRiddleLeaderboard: (riddleId: string) => void; // Pour nettoyer l'état
}

// État initial/par défaut pour un classement d'énigme non encore chargé
export const defaultRiddleLeaderboardState: RiddleLeaderboardState = {
  list: [],
  userRank: null,
  offset: 0,
  isLoading: false,
  hasMore: true, // Supposer qu'il y a plus au début
  error: null,
};

// --- Création du Store ---

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  // --- États Initiaux ---
  globalRankings: { week: [], month: [], all: [] },
  globalUserRanks: { week: null, month: null, all: null },
  globalIsLoading: false,
  globalError: null,
  riddleLeaderboards: {},

  // --- Actions Globales ---

  fetchGlobalRankings: async ({ limit = 10 } = {}) => { // Récupère le Top 10 par défaut
    set({ globalIsLoading: true, globalError: null });
    try {
      // L'endpoint /leaderboard/global doit retourner les 3 périodes
      const response = await axios.get(`${API_URL}/leaderboards/global`, {
        params: { limit }, // Passer la limite si l'API la supporte
      });
      // Supposons que la réponse est { week: [...], month: [...], all: [...] }
      set({
        globalRankings: {
          week: response.data.week || [],
          month: response.data.month || [],
          all: response.data.all || [],
        },
        globalIsLoading: false,
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>; // Typage de l'erreur Axios
      console.error('Erreur fetch classements globaux:', axiosError.response?.data || axiosError.message);
      const message = axiosError.response?.data?.message || 'Erreur chargement classements globaux';
      set({ globalIsLoading: false, globalError: message });
    }
  },

  fetchGlobalUserRank: async () => {
    // Pas besoin de isLoading ici si c'est appelé en même temps que fetchGlobalRankings
    try {
      // L'endpoint /users/me/leaderboard/global doit retourner les 3 périodes pour l'utilisateur
      const response = await axios.get(`${API_URL}/users/me/leaderboard/global`);
      // Supposons que la réponse est { week: UserRank|null, month: UserRank|null, all: UserRank|null }
      set({
        globalUserRanks: {
          week: response.data.week || null,
          month: response.data.month || null,
          all: response.data.all || null,
        },
        // globalError: null // Optionnel: réinitialiser l'erreur globale ici aussi
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      console.error('Erreur fetch rang global utilisateur:', axiosError.response?.data || axiosError.message);
      // Mettre à jour l'erreur globale si ce fetch échoue ?
      // set({ globalError: axiosError.response?.data?.message || 'Erreur chargement rang utilisateur' });
    }
  },

  // --- Actions par Énigme ---

  fetchRiddleLeaderboard: async (riddleId: string, { limit = 20, offset, refresh = false } = {}) => {
    // Récupérer l'état actuel pour ce riddle ou l'état par défaut
    const currentState = get().riddleLeaderboards[riddleId] || defaultRiddleLeaderboardState;
    // Déterminer l'offset à utiliser pour l'appel API
    const currentOffset = refresh ? 0 : offset ?? currentState.offset;

    // Empêcher les appels inutiles si déjà en chargement ou si on sait qu'il n'y a plus rien
    if (currentState.isLoading || (!currentState.hasMore && !refresh)) {
      console.log(`Fetch leaderboard pour ${riddleId} annulé (isLoading: ${currentState.isLoading}, hasMore: ${currentState.hasMore}, refresh: ${refresh})`);
      return;
    }

    // Mettre à jour l'état de chargement pour *ce riddle spécifique*
    set((state) => ({
      riddleLeaderboards: {
        ...state.riddleLeaderboards,
        [riddleId]: { ...currentState, isLoading: true, error: null },
      },
    }));

    console.log(`API Call: Fetching leaderboard for ${riddleId} - Offset: ${currentOffset}, Limit: ${limit}`);
    try {
      // Appel API vers l'endpoint spécifique de l'énigme
      const response = await axios.get(`${API_URL}/leaderboards/riddles/${riddleId}`, {
        params: { limit, offset: currentOffset },
      });

      // Extraire les données de la réponse
      const { leaderboard, userRank, meta } = response.data;
      const fetchedList: RiddleLeaderboardEntry[] = leaderboard || [];

      // Mettre à jour l'état dans le store pour ce riddleId
      set((state) => {
        const existingList = state.riddleLeaderboards[riddleId]?.list || [];
        // Construire la nouvelle liste (remplacer si refresh/offset=0, sinon ajouter)
        const newList = refresh || currentOffset === 0
          ? fetchedList
          : [...existingList, ...fetchedList];

        // Éviter les doublons (sécurité)
        const uniqueList = Array.from(new Map(newList.map(item => [item.id, item])).values());

        // Déterminer s'il y a plus de données à charger
        const hasMoreData = meta?.hasMore ?? (fetchedList.length === limit);

        console.log(`State Update for ${riddleId}: Fetched ${fetchedList.length}, Total unique: ${uniqueList.length}, HasMore: ${hasMoreData}`);

        return {
          riddleLeaderboards: {
            ...state.riddleLeaderboards,
            [riddleId]: {
              list: uniqueList,
              userRank: userRank || null, // Mettre à jour avec la nouvelle valeur (ou null)
              offset: currentOffset + fetchedList.length, // Mettre à jour l'offset
              isLoading: false,
              error: null,
              hasMore: hasMoreData, // Mettre à jour hasMore
            },
          },
        };
      });

    } catch (error) {
      const axiosError = error as AxiosError<any>;
      console.error(`Erreur fetch leaderboard pour riddle ${riddleId}:`, axiosError.response?.data || axiosError.message);
      const message = axiosError.response?.data?.message || 'Erreur chargement classement';
      // Mettre à jour l'état d'erreur pour ce riddle spécifique
      set((state) => ({
        riddleLeaderboards: {
          ...state.riddleLeaderboards,
          [riddleId]: {
            ...(state.riddleLeaderboards[riddleId] || defaultRiddleLeaderboardState), // Conserver les données existantes si possible
            isLoading: false,
            error: message,
          },
        },
      }));
    }
  },

  // Action pour nettoyer l'état d'un classement d'énigme (ex: quand on quitte l'écran)
  clearRiddleLeaderboard: (riddleId: string) => {
     set((state) => {
       const newRiddleLeaderboards = { ...state.riddleLeaderboards };
       // Supprime l'entrée pour ce riddleId du dictionnaire
       delete newRiddleLeaderboards[riddleId];
       console.log(`Cleared leaderboard state for riddle ${riddleId}`);
       return { riddleLeaderboards: newRiddleLeaderboards };
     });
  }
}));
import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

// Interface pour les listes (peut contenir moins d'infos que le détail)
export interface RiddleListItem {
  id: number;
  creator_id: number;
  title: string;
  is_private: boolean;
  status: 'active' | 'draft' | 'disabled'; // Ou les statuts que tu utilises
  latitude: string;
  longitude: string;
  created_at: string;
  // Champs agrégés potentiels (si l'API les fournit dans les listes)
  stepCount?: number;
  averageRating?: number;
  // difficulty?: number; // La difficulté est sur la Review, pas le Riddle ?
}

// Interface pour le détail complet d'une énigme
export interface RiddleDetail extends RiddleListItem {
  description: string;
  password?: string | null; // Présent seulement si autorisé (créateur)
  updated_at: string;
  // Peut-être des relations chargées ? (creator, etc.)
  // creator?: { id: number; name: string; };
}

// Interface pour la création/mise à jour
export interface RiddleFormData {
  title: string;
  description: string;
  is_private: boolean;
  password?: string | null;
  status?: 'active' | 'draft' | 'disabled'; // Optionnel à la création/maj ?
  latitude: string;
  longitude: string;
}

// Interface pour l'état d'une liste paginée
interface RiddleListState {
  riddles: RiddleListItem[];
  offset: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

// Interface pour l'état du détail
interface RiddleDetailState {
  riddle: RiddleDetail | null;
  isLoading: boolean;
  error: string | null;
}

// Interface globale du store
export interface RiddleStoreState {
  // Liste publique/filtrée (pour la carte/recherche)
  publicList: RiddleListState;
  // Liste des énigmes créées par l'utilisateur
  createdList: RiddleListState;
  // Détail de l'énigme actuellement consultée/modifiée
  riddleDetail: RiddleDetailState;

  // Actions
  fetchPublicList: (params?: { limit?: number; offset?: number; refresh?: boolean; /* autres filtres ? */ }) => Promise<void>;
  fetchCreatedList: (params?: { limit?: number; offset?: number; refresh?: boolean }) => Promise<void>;
  fetchRiddleDetail: (id: string) => Promise<RiddleDetail | null>; // Retourne le détail ou null en cas d'erreur
  createRiddle: (data: RiddleFormData) => Promise<RiddleDetail | null>; // Retourne l'énigme créée ou null
  updateRiddle: (id: string, data: Partial<RiddleFormData>) => Promise<RiddleDetail | null>; // Retourne l'énigme maj ou null
  deleteRiddle: (id: string) => Promise<boolean>; // Retourne true si succès
  clearRiddleDetail: () => void; // Pour nettoyer en quittant l'écran détail
}

// État initial pour une liste
const initialListState: RiddleListState = {
  riddles: [],
  offset: 0,
  hasMore: true,
  isLoading: false,
  error: null,
};

// État initial pour le détail
const initialDetailState: RiddleDetailState = {
  riddle: null,
  isLoading: false,
  error: null,
};

// --- Store ---
export const useRiddleStore = create<RiddleStoreState>((set, get) => ({
  publicList: { ...initialListState },
  createdList: { ...initialListState },
  riddleDetail: { ...initialDetailState },

  // --- Fetch Liste Publique (GET /riddles) ---
  fetchPublicList: async ({ limit = 20, offset, refresh = false, ...otherParams } = {}) => {
    const currentState = get().publicList;
    const currentOffset = refresh ? 0 : offset ?? currentState.offset;

    if (currentState.isLoading || (!currentState.hasMore && !refresh)) {
      return;
    }

    set((state) => ({
      publicList: { ...state.publicList, isLoading: true, error: null },
    }));

    try {
      const response = await axios.get<{ riddles: RiddleListItem[], meta: { total: number, hasMore?: boolean } }>(`${API_URL}/riddles`, {
        params: { limit, offset: currentOffset, ...otherParams }, // Inclure filtres additionnels
      });
      const { riddles, meta } = response.data;

      set((state) => {
        const existingRiddles = state.publicList.riddles;
        const newRiddles = refresh || currentOffset === 0 ? riddles : [...existingRiddles, ...riddles];
        // Simple dédoublonnage
        const uniqueRiddles = Array.from(new Map(newRiddles.map(r => [r.id, r])).values());

        return {
          publicList: {
            riddles: uniqueRiddles,
            offset: currentOffset + riddles.length,
            isLoading: false,
            error: null,
            hasMore: meta.hasMore ?? (riddles.length === limit),
          },
        };
      });
    } catch (error: any) {
      console.error('Erreur fetchPublicList:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement des énigmes';
      set((state) => ({
        publicList: { ...state.publicList, isLoading: false, error: message },
      }));
    }
  },

  // --- Fetch Liste Créée (GET /users/me/riddles/created) ---
  fetchCreatedList: async ({ limit = 20, offset, refresh = false } = {}) => {
    const currentState = get().createdList;
    const currentOffset = refresh ? 0 : offset ?? currentState.offset;

    if (currentState.isLoading || (!currentState.hasMore && !refresh)) {
      return;
    }

    set((state) => ({
      createdList: { ...state.createdList, isLoading: true, error: null },
    }));

    try {
      // Utilise la nouvelle route suggérée
      const response = await axios.get<{ riddles: RiddleListItem[], meta: { total: number, hasMore?: boolean } }>(`${API_URL}/users/me/riddles/created`, {
        params: { limit, offset: currentOffset },
      });
      const { riddles, meta } = response.data;

      set((state) => {
        const existingRiddles = state.createdList.riddles;
        const newRiddles = refresh || currentOffset === 0 ? riddles : [...existingRiddles, ...riddles];
        const uniqueRiddles = Array.from(new Map(newRiddles.map(r => [r.id, r])).values());

        return {
          createdList: {
            riddles: uniqueRiddles,
            offset: currentOffset + riddles.length,
            isLoading: false,
            error: null,
            hasMore: meta.hasMore ?? (riddles.length === limit),
          },
        };
      });
    } catch (error: any) {
      console.error('Erreur fetchCreatedList:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement des énigmes créées';
      set((state) => ({
        createdList: { ...state.createdList, isLoading: false, error: message },
      }));
    }
  },

  // --- Fetch Détail (GET /riddles/{id}) ---
  fetchRiddleDetail: async (id: string): Promise<RiddleDetail | null> => {
    // Optionnel: Vérifier si le détail est déjà chargé et correspond à l'ID
    // if (get().riddleDetail.riddle?.id.toString() === id && !get().riddleDetail.error) {
    //   return get().riddleDetail.riddle;
    // }

    set({ riddleDetail: { ...initialDetailState, isLoading: true } }); // Reset avant fetch

    try {
      const response = await axios.get<RiddleDetail>(`${API_URL}/riddles/${id}`);
      const riddleData = response.data;
      set({ riddleDetail: { riddle: riddleData, isLoading: false, error: null } });
      return riddleData;
    } catch (error: any) {
      console.error(`Erreur fetchRiddleDetail (${id}):`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement du détail';
      set({ riddleDetail: { riddle: null, isLoading: false, error: message } });
      return null;
    }
  },

  // --- Création (POST /riddles) ---
  createRiddle: async (data: RiddleFormData): Promise<RiddleDetail | null> => {
    // On pourrait ajouter un état isLoading spécifique à la création
    try {
      const response = await axios.post<RiddleDetail>(`${API_URL}/riddles`, data);
      const newRiddle = response.data;

      // Ajouter à la liste des énigmes créées (au début)
      set((state) => ({
        createdList: {
          ...state.createdList,
          riddles: [newRiddle, ...state.createdList.riddles],
          // Optionnel: ajuster offset/hasMore si nécessaire
        },
      }));
      return newRiddle;
    } catch (error: any) {
      console.error('Erreur createRiddle:', error.response?.data || error.message);
      // Retourner null ou lancer une erreur pour que le composant puisse la gérer
      // throw new Error(error.response?.data?.message || 'Erreur lors de la création');
      return null;
    }
  },

  // --- Mise à jour (PUT /riddles/{id}) ---
  updateRiddle: async (id: string, data: Partial<RiddleFormData>): Promise<RiddleDetail | null> => {
    try {
      const response = await axios.put<RiddleDetail>(`${API_URL}/riddles/${id}`, data);
      const updatedRiddle = response.data;

      set((state) => {
        // Fonction pour mettre à jour une liste
        const updateList = (list: RiddleListItem[]): RiddleListItem[] =>
          list.map(r => (r.id.toString() === id ? { ...r, ...updatedRiddle } : r)); // Mettre à jour l'item

        return {
          // Mettre à jour le détail si c'est l'énigme actuelle
          riddleDetail: state.riddleDetail.riddle?.id.toString() === id
            ? { ...state.riddleDetail, riddle: updatedRiddle, error: null } // Met à jour le détail chargé
            : state.riddleDetail, // Sinon, ne touche pas au détail
          // Mettre à jour dans les listes
          publicList: { ...state.publicList, riddles: updateList(state.publicList.riddles) },
          createdList: { ...state.createdList, riddles: updateList(state.createdList.riddles) },
        };
      });
      return updatedRiddle;
    } catch (error: any) {
      console.error(`Erreur updateRiddle (${id}):`, error.response?.data || error.message);
      // throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour');
      return null;
    }
  },

  // --- Suppression (DELETE /riddles/{id}) ---
  deleteRiddle: async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_URL}/riddles/${id}`);

      set((state) => {
        // Fonction pour filtrer une liste
        const filterList = (list: RiddleListItem[]): RiddleListItem[] =>
          list.filter(r => r.id.toString() !== id);

        return {
          // Nettoyer le détail si c'est l'énigme actuelle
          riddleDetail: state.riddleDetail.riddle?.id.toString() === id
            ? { ...initialDetailState } // Reset le détail
            : state.riddleDetail,
          // Filtrer les listes
          publicList: { ...state.publicList, riddles: filterList(state.publicList.riddles) },
          createdList: { ...state.createdList, riddles: filterList(state.createdList.riddles) },
        };
      });
      return true; // Succès
    } catch (error: any) {
      console.error(`Erreur deleteRiddle (${id}):`, error.response?.data || error.message);
      // throw new Error(error.response?.data?.message || 'Erreur lors de la suppression');
      return false; // Échec
    }
  },

  // --- Nettoyer le détail ---
  clearRiddleDetail: () => {
    set({ riddleDetail: { ...initialDetailState } });
  },

}));
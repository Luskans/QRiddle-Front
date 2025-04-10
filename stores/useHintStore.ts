import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Interface pour un indice (basée sur ton modèle)
export interface Hint {
  id: number;
  step_id: number; // Important pour savoir à quelle étape il appartient
  order_number: number; // Ordre d'affichage/déblocage
  type: 'text' | 'image' | 'audio'; // Types possibles d'indices
  content: string; // Contenu texte ou URL pour image/audio
  created_at: string;
  updated_at: string;
}

// Interface pour les données nécessaires à la création
export interface CreateHintData {
  type: 'text' | 'image' | 'audio';
  content: string;
  order_number?: number; // L'ordre peut être calculé côté backend
}

// Interface pour les données de mise à jour (partielles)
export type UpdateHintData = Partial<CreateHintData>;

// État pour les indices d'une étape spécifique
interface HintsForStepState {
  hints: Hint[];
  isLoading: boolean;
  error: string | null;
  // Pas de pagination ici, on charge tous les indices d'une étape
}

// État global du store
export interface HintState {
  // Dictionnaire pour stocker les indices par ID d'étape
  hintsByStep: {
    [stepId: string]: HintsForStepState;
  };

  // États pour les actions CUD (Create, Update, Delete)
  isLoadingAction: boolean;
  errorAction: string | null;

  // Fonctions
  fetchHintsByStep: (stepId: string) => Promise<void>;
  createHint: (stepId: string, data: CreateHintData) => Promise<Hint | null>;
  updateHint: (hintId: number, data: UpdateHintData) => Promise<Hint | null>;
  deleteHint: (hintId: number, stepId: string) => Promise<boolean>; // Retourne true si succès
  clearHintsForStep: (stepId: string) => void;
}

// État par défaut pour les indices d'une étape
const defaultHintsForStepState: HintsForStepState = {
  hints: [],
  isLoading: false,
  error: null,
};

export const useHintStore = create<HintState>((set, get) => ({
  hintsByStep: {},
  isLoadingAction: false,
  errorAction: null,

  // --- Fetch la liste des indices pour une étape ---
  fetchHintsByStep: async (stepId: string) => {
    const currentState = get().hintsByStep[stepId] || defaultHintsForStepState;

    // Éviter fetch multiple si déjà en cours
    if (currentState.isLoading) {
      return;
    }

    set((state) => ({
      hintsByStep: {
        ...state.hintsByStep,
        [stepId]: { ...currentState, isLoading: true, error: null },
      },
    }));

    try {
      // Appel API: GET /api/steps/{stepId}/hints
      const response = await axios.get<{ hints: Hint[] }>(`${API_URL}/steps/${stepId}/hints`);
      const fetchedHints = response.data.hints || [];

      // Trier par order_number
      fetchedHints.sort((a, b) => a.order_number - b.order_number);

      set((state) => ({
        hintsByStep: {
          ...state.hintsByStep,
          [stepId]: {
            hints: fetchedHints,
            isLoading: false,
            error: null,
          },
        },
      }));

    } catch (error: any) {
      console.error(`Erreur fetch hints pour step ${stepId}:`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement indices';
      set((state) => ({
        hintsByStep: {
          ...state.hintsByStep,
          [stepId]: {
            ...(state.hintsByStep[stepId] || defaultHintsForStepState),
            isLoading: false,
            error: message,
          },
        },
      }));
    }
  },

  // --- Créer un nouvel indice pour une étape ---
  createHint: async (stepId: string, data: CreateHintData): Promise<Hint | null> => {
    set({ isLoadingAction: true, errorAction: null });
    try {
      // Appel API: POST /api/steps/{stepId}/hints
      const response = await axios.post<Hint>(`${API_URL}/steps/${stepId}/hints`, data);
      const newHint = response.data;

      // Ajouter à l'état local
      set((state) => {
        const currentStepState = state.hintsByStep[stepId] || defaultHintsForStepState;
        const updatedHints = [...currentStepState.hints, newHint].sort((a, b) => a.order_number - b.order_number);
        return {
          hintsByStep: {
            ...state.hintsByStep,
            [stepId]: {
              ...currentStepState,
              hints: updatedHints,
            },
          },
          isLoadingAction: false,
        };
      });
      return newHint;

    } catch (error: any) {
      console.error(`Erreur create hint pour step ${stepId}:`, error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur création de l'indice";
      set({ isLoadingAction: false, errorAction: message });
      return null;
    }
  },

  // --- Mettre à jour un indice existant ---
  updateHint: async (hintId: number, data: UpdateHintData): Promise<Hint | null> => {
    set({ isLoadingAction: true, errorAction: null });
    try {
      // Appel API: PUT /api/hints/{hintId} (grâce à ->shallow())
      const response = await axios.put<Hint>(`${API_URL}/hints/${hintId}`, data);
      const updatedHint = response.data;
      const stepId = updatedHint.step_id.toString(); // Récupérer l'ID parent depuis la réponse

      // Mettre à jour dans l'état local
      set((state) => {
        const currentStepState = state.hintsByStep[stepId];
        if (!currentStepState) return { isLoadingAction: false }; // Ne rien faire si l'état parent n'existe pas

        const updatedHints = currentStepState.hints
          .map(hint => (hint.id === hintId ? updatedHint : hint))
          .sort((a, b) => a.order_number - b.order_number); // Re-trier

        return {
          hintsByStep: {
            ...state.hintsByStep,
            [stepId]: {
              ...currentStepState,
              hints: updatedHints,
            },
          },
          isLoadingAction: false,
        };
      });
      return updatedHint;

    } catch (error: any) {
      console.error(`Erreur update hint ${hintId}:`, error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur mise à jour de l'indice";
      set({ isLoadingAction: false, errorAction: message });
      return null;
    }
  },

  // --- Supprimer un indice ---
  deleteHint: async (hintId: number, stepId: string): Promise<boolean> => {
    set({ isLoadingAction: true, errorAction: null });
    try {
      // Appel API: DELETE /api/hints/{hintId} (grâce à ->shallow())
      await axios.delete(`${API_URL}/hints/${hintId}`);

      // Supprimer de l'état local
      set((state) => {
        const currentStepState = state.hintsByStep[stepId];
        if (!currentStepState) return { isLoadingAction: false };

        const updatedHints = currentStepState.hints.filter(hint => hint.id !== hintId);
        // Pas besoin de re-trier après suppression

        return {
          hintsByStep: {
            ...state.hintsByStep,
            [stepId]: {
              ...currentStepState,
              hints: updatedHints,
            },
          },
          isLoadingAction: false,
        };
      });
      return true; // Succès

    } catch (error: any) {
      console.error(`Erreur delete hint ${hintId}:`, error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur suppression de l'indice";
      set({ isLoadingAction: false, errorAction: message });
      return false; // Échec
    }
  },

  // --- Nettoyer l'état pour une étape spécifique ---
  clearHintsForStep: (stepId: string) => {
     set((state) => {
       const newHintsByStep = { ...state.hintsByStep };
       delete newHintsByStep[stepId];
       return { hintsByStep: newHintsByStep };
     });
  }
}));
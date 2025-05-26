import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

// Interface pour les données envoyées lors de la création (simplifiée)
export interface StepLocationData {
  latitude: string;
  longitude: string;
}

// Interface pour les données envoyées lors de la mise à jour (peut inclure plus)
export interface StepUpdateData {
  latitude?: string;
  longitude?: string;
  order_number?: number; // Si on permet la réorganisation
  // title?: string; // Si tu rajoutes un titre plus tard
  // description?: string; // Si tu rajoutes une description plus tard
}

// Interface représentant une Étape (basée sur ton modèle et la réponse API)
export interface Step {
  id: number;
  riddle_id: number;
  order_number: number;
  qr_code: string; // L'UUID pour la validation
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  qr_code_image_url?: string | null; // URL de l'image QR générée par le backend
  hints?: Hint[]; // Optionnel: si les indices sont chargés avec l'étape
}

// Interface pour l'état de la liste des étapes d'une énigme
interface StepsForRiddleState {
  steps: Step[];
  isLoading: boolean;
  error: string | null;
  // Pas besoin d'offset/hasMore si on charge toujours toutes les étapes d'une énigme
}

// Interface pour l'état du détail d'une étape
interface StepDetailState {
  step: Step | null;
  isLoading: boolean;
  error: string | null;
}

// Interface globale de l'état du store
export interface StepState {
  // Dictionnaire pour stocker les étapes par ID d'énigme
  stepsByRiddle: {
    [riddleId: string]: StepsForRiddleState;
  };
  // État pour le détail d'une étape consultée/modifiée
  stepDetail: StepDetailState;

  // État de chargement/erreur pour les actions CUD (Create/Update/Delete)
  isActing: boolean; // Indique si une action CUD est en cours
  actionError: string | null; // Erreur spécifique aux actions CUD

  // --- Fonctions (Actions) ---
  fetchStepsListByRiddle: (riddleId: string, options?: { forceRefresh?: boolean }) => Promise<void>;
  fetchStepDetail: (stepId: string | number) => Promise<Step | null>;
  createStep: (riddleId: string, data: StepLocationData) => Promise<Step | null>;
  updateStep: (stepId: string | number, data: StepUpdateData) => Promise<Step | null>;
  deleteStep: (stepId: string | number, riddleId: string) => Promise<boolean>; // Retourne true si succès
  clearStepsForRiddle: (riddleId: string) => void;
  clearStepDetail: () => void;
}

// --- État Initial ---

const defaultStepsForRiddleState: StepsForRiddleState = {
  steps: [],
  isLoading: false,
  error: null,
};

const defaultStepDetailState: StepDetailState = {
  step: null,
  isLoading: false,
  error: null,
};

// --- Création du Store ---

export const useStepStore = create<StepState>((set, get) => ({
  stepsByRiddle: {},
  stepDetail: { ...defaultStepDetailState },
  isActing: false,
  actionError: null,

  // --- Actions ---

  fetchStepsListByRiddle: async (riddleId: string, { forceRefresh = false } = {}) => {
    const currentState = get().stepsByRiddle[riddleId];

    // Ne recharge pas si déjà chargé et pas forcé, ou si déjà en cours de chargement
    if (!forceRefresh && currentState && !currentState.isLoading && currentState.steps.length > 0) {
      // console.log(`[StepStore] Steps for ${riddleId} already loaded.`);
      return;
    }
     if (currentState?.isLoading) {
      // console.log(`[StepStore] Already fetching steps for ${riddleId}.`);
      return;
     }

    // Met à jour l'état de chargement pour cette énigme
    set((state) => ({
      stepsByRiddle: {
        ...state.stepsByRiddle,
        [riddleId]: { ...(currentState || defaultStepsForRiddleState), isLoading: true, error: null },
      },
    }));

    try {
      // Appel API pour récupérer TOUTES les étapes de cette énigme (pas de pagination ici)
      const response = await axios.get<{ steps: Step[] }>(`${API_URL}/riddles/${riddleId}/steps`);
      const fetchedSteps = response.data.steps || [];

      // Trier les étapes par order_number
      fetchedSteps.sort((a, b) => a.order_number - b.order_number);

      // Met à jour l'état avec les étapes récupérées
      set((state) => ({
        stepsByRiddle: {
          ...state.stepsByRiddle,
          [riddleId]: {
            steps: fetchedSteps,
            isLoading: false,
            error: null,
          },
        },
      }));
      // console.log(`[StepStore] Fetched ${fetchedSteps.length} steps for riddle ${riddleId}`);

    } catch (error: any) {
      console.error(`[StepStore] Error fetching steps for riddle ${riddleId}:`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur lors du chargement des étapes';
      set((state) => ({
        stepsByRiddle: {
          ...state.stepsByRiddle,
          [riddleId]: {
            ...(state.stepsByRiddle[riddleId] || defaultStepsForRiddleState),
            isLoading: false,
            error: message,
          },
        },
      }));
    }
  },

  fetchStepDetail: async (stepId: string | number): Promise<Step | null> => {
    // Vérifier si on a déjà le détail ou si on est déjà en train de le charger
    const currentDetail = get().stepDetail;
    if (currentDetail.isLoading && currentDetail.step?.id === Number(stepId)) return currentDetail.step;
    // Optionnel: retourner le step du cache si déjà présent et non en chargement
    // if (!currentDetail.isLoading && currentDetail.step?.id === Number(stepId)) return currentDetail.step;

    set({ stepDetail: { ...defaultStepDetailState, isLoading: true } });

    try {
      const response = await axios.get<Step>(`${API_URL}/steps/${stepId}`); // Utilise la route shallow
      const fetchedStep = response.data;
      set({ stepDetail: { step: fetchedStep, isLoading: false, error: null } });
      return fetchedStep;

    } catch (error: any) {
      console.error(`[StepStore] Error fetching step detail ${stepId}:`, error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur lors du chargement du détail de l'étape";
      set({ stepDetail: { step: null, isLoading: false, error: message } });
      return null;
    }
  },

  createStep: async (riddleId: string, data: StepLocationData): Promise<Step | null> => {
    set({ isActing: true, actionError: null }); // Indique qu'une action est en cours

    try {
      const response = await axios.post<Step>(`${API_URL}/riddles/${riddleId}/steps`, data);
      const newStep = response.data;

      // Met à jour la liste des étapes pour cette énigme
      set((state) => {
        const currentRiddleState = state.stepsByRiddle[riddleId] || defaultStepsForRiddleState;
        const updatedSteps = [...currentRiddleState.steps, newStep].sort((a, b) => a.order_number - b.order_number);
        return {
          stepsByRiddle: {
            ...state.stepsByRiddle,
            [riddleId]: {
              ...currentRiddleState,
              steps: updatedSteps,
              // Remettre isLoading à false si on l'avait utilisé ici
            },
          },
          isActing: false, // Action terminée
        };
      });
      return newStep;

    } catch (error: any) {
      console.error(`[StepStore] Error creating step for riddle ${riddleId}:`, error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur lors de la création de l'étape";
      set({ isActing: false, actionError: message }); // Action terminée avec erreur
      return null;
    }
  },

  updateStep: async (stepId: string | number, data: StepUpdateData): Promise<Step | null> => {
    set({ isActing: true, actionError: null });

    try {
      const response = await axios.put<Step>(`${API_URL}/steps/${stepId}`, data); // Ou PATCH si tu préfères
      const updatedStep = response.data;
      const riddleId = updatedStep.riddle_id.toString();

      // Met à jour le détail si c'est l'étape actuellement affichée
      if (get().stepDetail.step?.id === updatedStep.id) {
        set((state) => ({
          stepDetail: { ...state.stepDetail, step: updatedStep },
        }));
      }

      // Met à jour la liste des étapes pour l'énigme concernée
      set((state) => {
        const currentRiddleState = state.stepsByRiddle[riddleId];
        if (!currentRiddleState) return {}; // Ne rien faire si la liste n'est pas chargée

        const updatedSteps = currentRiddleState.steps
          .map(step => (step.id === updatedStep.id ? updatedStep : step))
          .sort((a, b) => a.order_number - b.order_number); // Retrier si l'ordre a pu changer

        return {
          stepsByRiddle: {
            ...state.stepsByRiddle,
            [riddleId]: {
              ...currentRiddleState,
              steps: updatedSteps,
            },
          },
          isActing: false,
        };
      });
      return updatedStep;

    } catch (error: any) {
      console.error(`[StepStore] Error updating step ${stepId}:`, error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de l'étape";
      set({ isActing: false, actionError: message });
      return null;
    }
  },

  deleteStep: async (stepId: string | number, riddleId: string): Promise<boolean> => {
    set({ isActing: true, actionError: null });

    try {
      await axios.delete(`${API_URL}/steps/${stepId}`);

      // Supprime l'étape du détail si c'est l'étape affichée
      if (get().stepDetail.step?.id === Number(stepId)) {
        set({ stepDetail: { ...defaultStepDetailState } });
      }

      // Supprime l'étape de la liste
      set((state) => {
        const currentRiddleState = state.stepsByRiddle[riddleId];
        if (!currentRiddleState) return {};

        const updatedSteps = currentRiddleState.steps.filter(step => step.id !== Number(stepId));
        // Optionnel: Recalculer les order_number des étapes suivantes ? Ou le gérer côté backend ?
        // Pour l'instant, on ne recalcule pas ici.

        return {
          stepsByRiddle: {
            ...state.stepsByRiddle,
            [riddleId]: {
              ...currentRiddleState,
              steps: updatedSteps,
            },
          },
          isActing: false,
        };
      });
      return true; // Succès

    } catch (error: any) {
      console.error(`[StepStore] Error deleting step ${stepId}:`, error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur lors de la suppression de l'étape";
      set({ isActing: false, actionError: message });
      return false; // Échec
    }
  },

  // --- Fonctions de Nettoyage ---

  clearStepsForRiddle: (riddleId: string) => {
    set((state) => {
      const newStepsByRiddle = { ...state.stepsByRiddle };
      delete newStepsByRiddle[riddleId];
      return { stepsByRiddle: newStepsByRiddle };
    });
    // console.log(`[StepStore] Cleared steps state for riddle ${riddleId}`);
  },

  clearStepDetail: () => {
    set({ stepDetail: { ...defaultStepDetailState } });
    // console.log(`[StepStore] Cleared step detail state`);
  },

}));
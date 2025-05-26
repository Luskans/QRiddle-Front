import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

export interface Hint {
  id: number;
  step_id: number;
  order_number: number;
  type: 'text' | 'image' | 'audio';
  content: string;
  created_at: string;
  updated_at: string;
}

export interface HintsByStep {
  hints: Hint[];
  isLoading: boolean;
  error: string | null;
}

export interface HintFormData {
  type: 'text' | 'image' | 'audio';
  content: string;
}

export interface HintStore {
  hintsByStep: {
    [stepId: string]: HintsByStep
  };

  fetchHintsByStepId: (stepId: string) => Promise<void>;
  createHint: (stepId: string, data: HintFormData) => Promise<Hint | null>;
  updateHint: (id: string, data: Partial<HintFormData>) => Promise<Hint | null>;
  deleteHint: (id: string, stepId: string) => Promise<boolean>;
}

export const defaultHintsByStepState: HintsByStep = {
  hints: [],
  isLoading: false,
  error: null,
};


// --- Store ---

export const useHintStore = create<HintStore>((set, get) => ({
  hintsByStep: {},

  // --- Fetch liste des indices pour une étape (GET /steps/[stepId]/hints) ---
  fetchHintsByStepId: async (stepId: string) => {
    const currentState = get().hintsByStep[stepId] ?? defaultHintsByStepState;

    if (currentState.isLoading) {
      return;
    }

    set((state) => ({
      hintsByStep: {
        ...state.hintsByStep,
        [stepId]: {
          ...currentState,
          isLoading: true,
          error: null,
        },
      },
    }));

    try {
      const response = await axios.get(`${API_URL}/steps/${stepId}/hints`);
      const data = response.data;
      console.log("FETCH HINTS BY STEP", response.data)

      set((state) => ({
        hintsByStep: {
          ...state.hintsByStep,
          [stepId]: {
            hints: data.hints,
            isLoading: false,
            error: null
          },
        },
      }));

    } catch (error: any) {
      console.error('Erreur fetchHintsByStep:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement des indices de l\'étape';
      set((state) => ({
        hintsByStep: {
          ...state.hintsByStep,
          [stepId]: {
            ...currentState,
            isLoading: false,
            error: message,
          },
        },
      }));
    }
  },

  // --- Création d'un indices (POST /steps/[stepId]/hints) ---
  createHint: async (stepId: string, data: HintFormData): Promise<Hint | null> => {
    try {
      const response = await axios.post(`${API_URL}/steps/${stepId}/hints`, data);
      const newHint = response.data;
      console.log("CREATE HINT", response.data);

      set((state) => ({
        // clear hintsByStep list
      }));

      return newHint;

    } catch (error: any) {
      console.error('Erreur createHint:', error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur lors de la création de l'indice";
      return null;
    }
  },

  // --- Mise à jour d'un indice (PUT /hints/{id}) ---
  updateHint: async (id: string, data: Partial<HintFormData>): Promise<Hint | null> => {
    try {
      const response = await axios.put(`${API_URL}/hints/${id}`, data);
      const updatedHint = response.data;
      console.log("UPDATE HINT", response.data);

      set((state) => {
        const stepKey = updatedHint.step_id.toString();
        const currentState = state.hintsByStep[stepKey] ?? defaultHintsByStepState;
        const updatedHints = currentState.hints.map((hint) => hint.id === updatedHint.id ? updatedHint : hint);
        return {
          hintsByStep: {
            ...state.hintsByStep,
            [stepKey]: {
              hints: updatedHints,
              isLoading: false,
              error: null,
            },
          },
        };
      });

      return updatedHint;

    } catch (error: any) {
      console.error(`Erreur updateHint (${id}):`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur mise à jour de l\'étape';
      // set((state) => ({
      //   hintsByStep: {
      //     ...state.hintsByStep,
      //     [updatedHint.step_id]: {
      //       ...state.hintsByStep[updatedHint.step_id]
      //       isLoading: false,
      //       error: message,
      //     },
      //   },
      // }));

      return null;
    }
  },

  // --- Suppression d'un indice (DELETE /hints/{id}) ---
  deleteHint: async (id: string, stepId: string): Promise<boolean> => {
    try {
      const response = await axios.delete(`${API_URL}/hints/${id}`);
      console.log("DELETE HINT", response.data);

      set((state) => {
        const currentState = state.hintsByStep[stepId] ?? defaultHintsByStepState;
        const updatedHints = currentState.hints.filter((hint) => hint.id.toString() !== id);
        return {
          hintsByStep: {
            ...state.hintsByStep,
            [stepId]: {
              ...currentState,
              hints: updatedHints,
            },
          },
        };
      });
      return true;

    } catch (error: any) {
      console.error(`Erreur deleteHint (${id}):`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur suppression de l\'indice';
      // set(state => ({
      //   stepById: {
      //     ...state.stepById,
      //     [id]: {
      //       ...state.stepById[id],
      //       isLoading: false,
      //       error: message,
      //     }
      //   }
      // }));
      return false;
    }
  },

}));
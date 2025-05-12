import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

export interface Step {
  id: number;
  riddle_id: number;
  order_number: number;
  qr_code: string;
}

export interface StepsByRiddle {
  steps: Step[];
  isLoading: boolean;
  error: string | null;
}

export interface StepStore {
  stepsByRiddle: {
    [riddleId: string]: StepsByRiddle
  };

  fetchStepsByRiddle: (riddleId: string) => Promise<void>;
}

export const defaultStepsByRiddleState: StepsByRiddle = {
  steps: [],
  isLoading: false,
  error: null,
};

// --- Store ---

export const useStepStore = create<StepStore>((set, get) => ({
  stepsByRiddle: {},

  // --- Fetch liste des étapes pour un riddle (GET /riddles/[riddleId]/steps) ---
  fetchStepsByRiddle: async (riddleId: string) => {
    const currentState = get().stepsByRiddle[riddleId] ?? defaultStepsByRiddleState;

    if (currentState.isLoading) {
      return;
    }

    set((state) => ({
      stepsByRiddle: {
        ...state.stepsByRiddle,
        [riddleId]: {
          ...currentState,
          steps: currentState.steps,
          isLoading: true,
          error: null,
        },
      },
    }));

    try {
      const response = await axios.get(`${API_URL}/riddles/${riddleId}/steps`);
      const data = response.data;
      console.log("FETCH STEPS BY RIDDLE", response.data)

      set((state) => ({
        stepsByRiddle: {
          ...state.stepsByRiddle,
          [riddleId]: {
            ...state.stepsByRiddle[riddleId],
            steps: data.steps,
            isLoading: false,
          },
        },
      }));

    } catch (error: any) {
      console.error('Erreur fetchStepsByRiddle:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement des avis de l\'énigmes';
      set((state) => ({
        stepsByRiddle: {
          ...state.stepsByRiddle,
          [riddleId]: {
            ...(state.stepsByRiddle[riddleId] ?? defaultStepsByRiddleState),
            isLoading: false,
            error: message,
          },
        },
      }));
    }
  },

}));
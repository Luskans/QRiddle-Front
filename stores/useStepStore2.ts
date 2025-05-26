import { create } from 'zustand';
import axios from 'axios';
import { Hint } from './useHintStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

export interface StepItem {
  id: number;
  // riddle_id: number;
  order_number: number;
  // qr_code: string;
}

export interface Step {
  id: number;
  riddle_id: number;
  order_number: number;
  qr_code: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  // hints: Hint[] | [];
}

export interface StepsByRiddle {
  steps: StepItem[];
  isLoading: boolean;
  error: string | null;
}

export interface StepById {
  step: Step | null;
  isLoading: boolean;
  error: string | null;
}

export interface StepFormData {
  latitude: string;
  longitude: string;
}

export interface StepStore {
  stepsByRiddle: {
    [riddleId: string]: StepsByRiddle
  };
  stepById: {
    [stepId: string]: StepById
  };


  fetchStepsByRiddleId: (riddleId: string) => Promise<void>;
  fetchStepById: (id: string) => Promise<void>;
  createStep: (riddleId: string, data: StepFormData) => Promise<Step | null>;
  updateStep: (id: string, data: Partial<StepFormData>) => Promise<Step | null>;
  deleteStep: (id: string) => Promise<boolean>;
}

export const defaultStepsByRiddleState: StepsByRiddle = {
  steps: [],
  isLoading: false,
  error: null,
};

export const defaultStepByIdState: StepById = {
  step: null,
  isLoading: false,
  error: null,
};


// --- Store ---

export const useStepStore = create<StepStore>((set, get) => ({
  stepsByRiddle: {},
  stepById: {},

  // --- Fetch liste des étapes pour un riddle (GET /riddles/[riddleId]/steps) ---
  fetchStepsByRiddleId: async (riddleId: string) => {
    const currentState = get().stepsByRiddle[riddleId] ?? defaultStepsByRiddleState;

    if (currentState.isLoading) {
      return;
    }

    set((state) => ({
      stepsByRiddle: {
        ...state.stepsByRiddle,
        [riddleId]: {
          ...currentState,
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
            steps: data.steps,
            isLoading: false,
            error: null
          },
        },
      }));

    } catch (error: any) {
      console.error('Erreur fetchStepsByRiddle:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement des étapes de l\'énigme';
      set((state) => ({
        stepsByRiddle: {
          ...state.stepsByRiddle,
          [riddleId]: {
            ...currentState,
            isLoading: false,
            error: message,
          },
        },
      }));
    }
  },

  // --- Fetch détail d'une étape (GET /steps/{id}) ---
  fetchStepById: async (id: string) => {
    const currentState = get().stepById[id] ?? defaultStepByIdState;

    if (currentState.isLoading) {
      return;
    }

    set((state) => ({
      stepById: {
        ...state.stepById,
        [id]: { 
          ...currentState,
          isLoading: true,
          error: null 
        },
      },
    }));

    try {
      const response = await axios.get(`${API_URL}/steps/${id}`);
      const data = response.data;
      console.log("FETCH STEP DETAIL", response.data)

      set((state) => ({
        stepById: {
          ...state.stepById,
          [id]: {
            step: data,
            isLoading: false,
            error: null,
          },
        },
      }));

    } catch (error: any) {
      console.error(`Erreur fetchStepById (${id}):`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement du détail de l\'éatpe';
      set(state => ({
        stepById: {
          ...state.stepById,
          [id]: {
            ...currentState,
            isLoading: false,
            error: message,
          }
        }
      }));
    }
  },

  // --- Création d'une étape (POST /riddles/[riddleId]/steps) ---
  createStep: async (riddleId: string, data: StepFormData): Promise<Step | null> => {
    try {
      const response = await axios.post(`${API_URL}/riddles/${riddleId}/steps`, data);
      const newStep = response.data;
      console.log("CREATE STEP", response.data);

      set((state) => ({
        // clear stepsByRiddle list
        // clear stepById list
      }));

      return newStep;

    } catch (error: any) {
      console.error('Erreur createStep:', error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur lors de la création de l'étape";
      return null;
    }
  },

  // --- Mise à jour d'une étape (PUT /steps/{id}) ---
  updateStep: async (id: string, data: Partial<StepFormData>): Promise<Step | null> => {
    try {
      const response = await axios.put(`${API_URL}/steps/${id}`, data);
      const updatedStep = response.data;
      console.log("UPDATE STEP", response.data);

      set((state) => ({
        // clear stepsByRiddle list
        stepById: {
          ...state.stepById,
          [id]: {
            step: updatedStep,
            isLoading: false,
            error: null,
          },
        },
      }));

      return updatedStep;

    } catch (error: any) {
      console.error(`Erreur updateStep (${id}):`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur mise à jour de l\'étape';
      set(state => ({
        stepById: {
          ...state.stepById,
          [id]: {
            ...state.stepById[id],
            isLoading: false,
            error: message,
          }
        }
      }));

      return null;
    }
  },

  // --- Suppression d'une étape (DELETE /steps/{id}) ---
  deleteStep: async (id: string): Promise<boolean> => {
    try {
      const response = await axios.delete(`${API_URL}/steps/${id}`);
      console.log("DELETE STEP", response.data);

      // set((state) => {
      //   // clear les listes et detail
      // });

      return true;

    } catch (error: any) {
      console.error(`Erreur deleteStep (${id}):`, error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur suppression de l\'étape';
      set(state => ({
        stepById: {
          ...state.stepById,
          [id]: {
            ...state.stepById[id],
            isLoading: false,
            error: message,
          }
        }
      }));
      return false;
    }
  },

}));
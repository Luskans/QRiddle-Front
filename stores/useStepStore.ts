import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Hint {
  id: number;
  step_id: number;
  order_number: number;
  type: 'text' | 'image' | 'audio';
  content: string;
  created_at: string;
  updated_at: string;
}

export interface StepDetail {
  id: number;
  riddle_id: number;
  order_number: number;
  qr_code: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  hints: Hint[];
}

export interface StepList {
  id: number;
  riddle_id: number;
  order_number: number;
  qr_code: string;
  // latitude: string;
  // longitude: string;
  // created_at: string;
  // updated_at: string;
}

export interface DraftCreate {
  // riddle_id: number;
  // order_number: number;
  // qr_code: string;
  latitude: string;
  longitude: string;
  // hints: Hint[];
}

export interface StepState {
  stepList: {
    steps: StepList[];
    isLoading: boolean;
    error: string | null;
  }
  stepDetail: {
    step: StepDetail | null;
    isLoading: boolean;
    error: string | null;
  }
  draftCreate: {
    isLoading: boolean,
    error: string | null,
  },

  fetchStepList: (id: string) => Promise<void>;
  fetchStepDetail: (id: string) => Promise<void>;
  createStep: (riddleId: string, data: DraftCreate) => Promise<StepDetail | void>;
  updateStep: (id: string, data: Partial<DraftCreate>) => Promise<void>;
  deleteStep: (id: string) => Promise<void>;
}

export const useStepStore = create<StepState>((set, get) => ({
  stepList: {
    steps: [],
    isLoading: false,
    error: null,
  },
  stepDetail: {
    step: null,
    isLoading: false,
    error: null,
  },
  draftCreate: {
    isLoading: false,
    error: null,
  },

  fetchStepList: async (id) => {
    set((state) => ({
      stepList: { ...state.stepList, isLoading: true, error: null }
    }));

    try {
      const response = await axios.get(`${API_URL}/riddles/${id}/steps`);
      const data = response.data;
      console.log("response data", data);

      set((state) => ({
        stepList: {
          ...state.stepList,
          steps: data || [],
          isLoading: false,
          error: null,
        }
      }));

    } catch (error: any) {
      console.error('Erreur lors du fetch de la liste des steps:', error);
      set((state) => ({
        stepList: {
          ...state.stepList,
          isLoading: false,
          error: error.response?.data?.message || 'Erreur lors du chargement de la liste des steps'
        }
      }));
    }
  },

  fetchStepDetail: async (id: number) => {
    set((state) => ({
      stepDetail: { ...state.stepDetail, isLoading: true, error: null }
    }));
    try {
      const response = await axios.get(`${API_URL}/steps/${id}`);
      // On attend que l'API renvoie soit { step: {...} } soit directement l'objet step
      const data = response.data;
      set((state) => ({
        stepDetail: {
          ...state.stepDetail,
          step: data.step || data,
        }
      }));
    } catch (error: any) {
      console.error('Erreur lors du fetch du détail de la step:', error);
      set((state) => ({
        stepDetail: {
          ...state.stepDetail,
          error: error.response?.data?.message || 'Erreur lors du chargement du détail de la step'
        }
      }));
    } finally {
      set((state) => ({
        stepDetail: { ...state.stepDetail, isLoading: false }
      }));
    }
  },

  createStep: async (riddleId, data) => {
    set((state) => ({
      draftCreate: { ...state.draftCreate, isLoading: true, error: null },
    }));

    try {
      const response = await axios.post(`${API_URL}/riddles/${riddleId}/steps`, data);
      return response.data;
    
    } catch (error: any) {
      console.error('Erreur lors de la création de la step:', error);
      set((state) => ({
        draftCreate: {
          ...state.draftCreate,
          error: error.response?.data?.message || 'Erreur lors du chargement de la liste des étapes',
        },
      }));

    } finally {
      set((state) => ({
        draftCreate: { ...state.draftCreate, isLoading: false },
      }));
    }
  },

  // Met à jour une step existante
  updateStep: async (id: number, data: Partial<DraftCreate>) => {
    try {
      const response = await axios.put(`${API_URL}/steps/${id}`, data);
      set((state) => ({
        stepList: {
          ...state.stepList,
          steps: state.stepList.steps!.map((step) =>
            step.id === id ? response.data : step
          )
        },
        stepDetail: state.stepDetail.step && state.stepDetail.step.id === id ? {
          ...state.stepDetail,
          step: response.data,
        } : state.stepDetail,
      }));
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la step:', error);
    }
  },

  // Supprime une step
  deleteStep: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/steps/${id}`);
      set((state) => ({
        stepList: {
          ...state.stepList,
          steps: state.stepList.steps!.filter((step) => step.id !== id),
        }
      }));
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la step:', error);
      set((state) => ({
        stepDetail: {
          ...state.stepDetail,
          error: error.response?.data?.message || 'Erreur lors de la suppression de la step'
        }
      }));
    }
  },

}));
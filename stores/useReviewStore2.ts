import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// --- Interfaces ---

export interface Review {
  id: number;
  riddle_id: number;
  user_id: number;
  content: string;
  rating: number;
  difficulty: number;
  updated_at: string;
  user: {
    id: number;
    name: string;
    image: string;
  };
}

export interface ReviewsByRiddle {
  reviews: Review[];
  offset: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

export interface ReviewStore {
  reviewsByRiddle: {
    [riddleId: string]: ReviewsByRiddle
  };

  fetchReviewsByRiddle: (riddleId: string, params?: { limit?: number; offset?: number; refresh?: boolean }) => Promise<void>;
}

export const defaultReviewsByRiddleState: ReviewsByRiddle = {
  reviews: [],
  offset: 0,
  isLoading: false,
  hasMore: true,
  error: null,
};

// --- Store ---

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviewsByRiddle: {},

  // --- Fetch liste des reviews pour un riddle (GET /riddles/[riddleId]/reviews) ---
  fetchReviewsByRiddle: async (riddleId: string, { limit = 20, offset, refresh = false } = {}) => {
    const currentState = get().reviewsByRiddle[riddleId] ?? defaultReviewsByRiddleState;
    const currentOffset = refresh ? 0 : offset ?? currentState.offset;

    if (currentState.isLoading || (!currentState.hasMore && !refresh)) {
      return;
    }

    set((state) => ({
      reviewsByRiddle: {
        ...state.reviewsByRiddle,
        [riddleId]: {
          ...currentState,
          reviews: refresh ? [] : currentState.reviews,
          offset: refresh ? 0 : currentState.offset,
          isLoading: true,
          error: null,
          hasMore: refresh ? true : currentState.hasMore,
        },
      },
    }));

    try {
      const response = await axios.get<{ reviews: Review[], meta: { total: number, hasMore?: boolean } }>(`${API_URL}/riddles/${riddleId}/reviews`, {
        params: { limit, offset: currentOffset },
      });

      const { reviews, meta } = response.data;
      console.log("FETCH REVIEWS BY RIDDLE", response.data)

      set((state) => {
        const existingReviews = state.reviewsByRiddle[riddleId]?.reviews;
        const newReviewsList = refresh || currentOffset === 0 ? reviews : [...existingReviews, ...reviews];
        const uniqueReviews = Array.from(new Map(newReviewsList.map(r => [r.id, r])).values());

        return {
          reviewsByRiddle: {
            ...state.reviewsByRiddle,
            [riddleId]: {
              ...state.reviewsByRiddle[riddleId],
              reviews: uniqueReviews,
              offset: currentOffset + reviews.length,
              isLoading: false,
              error: null,
              hasMore: meta.hasMore ?? (reviews.length === limit),
            },
          },
        };
      });

    } catch (error: any) {
      console.error('Erreur fetchReviewsByRiddle:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur chargement des avis de l\'énigmes';
      set((state) => ({
        reviewsByRiddle: {
          ...state.reviewsByRiddle,
          [riddleId]: {
            ...(state.reviewsByRiddle[riddleId] ?? defaultReviewsByRiddleState),
            isLoading: false,
            error: message,
          },
        },
      }));
    }
  },

}));
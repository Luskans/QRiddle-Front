import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Review {
  id: number;
  content: string;
  rating: number;
  difficulty: number;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    image: string;
  }
}

export interface ReviewState {
  reviewList: Review[];
  offset: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  fetchReviewList: (riddleId: string, params?: { limit?: number; offset?: number }) => Promise<void>;
  createReview: (data: Partial<Review>) => Promise<void>;
  updateReview: (id: number, data: Partial<Review>) => Promise<void>;
  deleteReview: (id: number) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviewList: [],
  offset: 0,
  isLoading: false,
  hasMore: true,
  error: null,

  fetchReviewList: async (riddleId, { limit = 20, offset = 0 } = {}) => {
    set((state) => ({ isLoading: true, error: null }));
    try {
      const response = await axios.get(`${API_URL}/riddles/${riddleId}/reviews`, {
        params: { limit, offset },
      });
      const data = response.data || [];

      set((state) => ({
        reviewList: offset === 0 ? data.reviews : [...state.reviewList, ...data.reviews],
        offset: state.offset + data.reviews.length,
        isLoading: false,
        error: null,
        hasMore: data.reviews.length === limit
      }));

    } catch (error: any) {
      console.error('Erreur lors du fetch de la liste des reviews:', error);
      set((state) => ({
        error: error.response?.data?.message || 'Erreur lors du chargement de la liste des reviews',
        isLoading: false
      }));
    }
  },

  createReview: async (data: Partial<Review>) => {
    try {
      const response = await axios.post(`${API_URL}/reviews`, data);
      set((state) => ({
        reviewList: [response.data, ...state.reviewList],
      }));
    } catch (error: any) {
      console.error('Erreur lors de la création de la review:', error);
      set((state) => ({
        error: error.response?.data?.message || 'Erreur lors de la création de la review',
      }));
    }
  },

  updateReview: async (id: number, data: Partial<Review>) => {
    try {
      const response = await axios.put(`${API_URL}/reviews/${id}`, data);
      set((state) => ({
        reviewList: state.reviewList!.map((review) =>
          review.id === id ? response.data : review
        ),
      }));
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la review:', error);
      set((state) => ({
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de la review',
      }));
    }
  },

  deleteReview: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/reviews/${id}`);
      set((state) => ({
        reviewList: state.reviewList!.filter(review => review.id !== id),
      }));
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la review:', error);
      set((state) => ({
        error: error.response?.data?.message || 'Erreur lors de la suppression de la review',
      }));
    }
  },

}));
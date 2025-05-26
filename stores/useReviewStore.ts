import { create } from 'zustand';
import axios, { AxiosError } from 'axios'; // Importer AxiosError pour un meilleur typage d'erreur

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Interface pour une Review (Assurez-vous qu'elle correspond à votre API)
// J'ai ajouté riddle_id et user_id, et un objet user optionnel
export interface Review {
  id: number;
  riddle_id: number; // ID de l'énigme associée (important pour l'état)
  user_id: number;   // ID de l'utilisateur qui a posté
  content: string;
  rating: number;    // Note donnée par l'utilisateur
  // difficulty?: number; // Est-ce que la review a une difficulté ? Ou c'est sur le riddle ? A clarifier.
  created_at: string;
  updated_at: string;
  // Informations sur l'utilisateur (si votre API les joint)
  user?: {
    id: number;
    name: string;
    image?: string | null; // URL de l'avatar
  };
}

// Interface pour l'état des reviews d'UNE énigme spécifique
interface ReviewsForRiddleState {
  reviews: Review[];
  offset: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

// Interface pour l'état global du store
export interface ReviewState {
  // Dictionnaire pour stocker les reviews par ID de riddle
  reviewsByRiddle: {
    [riddleId: string]: ReviewsForRiddleState | undefined; // Peut être undefined si jamais chargé
  };

  // Fonctions
  fetchReviewList: (riddleId: string, params?: { limit?: number; offset?: number; refresh?: boolean }) => Promise<void>;
  createReview: (riddleId: string, data: { content: string; rating: number; /* difficulty?: number */ }) => Promise<Review | null>;
  updateReview: (reviewId: number, data: Partial<{ content: string; rating: number; /* difficulty?: number */ }>) => Promise<Review | null>;
  deleteReview: (reviewId: number, riddleId: string) => Promise<boolean>; // Retourne true si succès
  clearReviewsForRiddle: (riddleId: string) => void;
}

// État initial par défaut pour une entrée de riddle non encore chargée
export const defaultRiddleReviewState: ReviewsForRiddleState = {
  reviews: [],
  offset: 0,
  isLoading: false,
  hasMore: true, // On suppose qu'il y a potentiellement plus de données au début
  error: null,
};

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviewsByRiddle: {},

  /**
   * Récupère la liste des reviews pour une énigme spécifique, avec pagination.
   */
  fetchReviewList: async (riddleId: string, { limit = 10, offset, refresh = false } = {}) => {
    // Récupère l'état actuel pour ce riddle ou utilise l'état par défaut
    const currentState = get().reviewsByRiddle[riddleId] ?? defaultRiddleReviewState;

    // Détermine l'offset à utiliser pour la requête API
    // Si refresh=true, on repart de 0.
    // Si offset est fourni explicitement, on l'utilise.
    // Sinon, on utilise l'offset actuel stocké dans l'état.
    const currentOffset = refresh ? 0 : offset ?? currentState.offset;

    // Évite les requêtes inutiles si on est déjà en train de charger,
    // ou s'il n'y a plus de données à charger (et qu'on ne force pas un refresh).
    if (currentState.isLoading || (!currentState.hasMore && !refresh)) {
      console.log(`[ReviewStore] Fetch skipped for riddle ${riddleId} (loading: ${currentState.isLoading}, hasMore: ${currentState.hasMore}, refresh: ${refresh})`);
      return;
    }

    console.log(`[ReviewStore] Fetching reviews for riddle ${riddleId} with offset ${currentOffset}, limit ${limit}`);

    // Met à jour l'état pour indiquer le début du chargement pour ce riddle spécifique
    set((state) => ({
      reviewsByRiddle: {
        ...state.reviewsByRiddle,
        [riddleId]: { ...currentState, isLoading: true, error: null },
      },
    }));

    try {
      // Appel API à l'endpoint spécifique pour les reviews d'une énigme
      const response = await axios.get<{ reviews: Review[], meta?: { hasMore?: boolean } }>(`${API_URL}/riddles/${riddleId}/reviews`, {
        params: { limit, offset: currentOffset },
      });

      const fetchedReviews = response.data.reviews || [];
      // Utilise la métadonnée 'hasMore' de l'API si elle existe, sinon calcule basé sur la limite
      const hasMoreFromMeta = response.data.meta?.hasMore;
      const calculatedHasMore = fetchedReviews.length === limit;
      const hasMore = typeof hasMoreFromMeta === 'boolean' ? hasMoreFromMeta : calculatedHasMore;

      // Met à jour l'état avec les nouvelles données pour ce riddle
      set((state) => {
        const existingReviews = state.reviewsByRiddle[riddleId]?.reviews || [];
        // Si c'est un refresh ou le premier chargement (offset 0), on remplace la liste.
        // Sinon, on ajoute les nouvelles reviews à la liste existante.
        const newReviewsList = refresh || currentOffset === 0
          ? fetchedReviews
          : [...existingReviews, ...fetchedReviews];

        // Optionnel mais recommandé: Éviter les doublons stricts basés sur l'ID
        const uniqueReviews = Array.from(new Map(newReviewsList.map(r => [r.id, r])).values());

        return {
          reviewsByRiddle: {
            ...state.reviewsByRiddle,
            [riddleId]: {
              ...state.reviewsByRiddle[riddleId], // Conserve les propriétés non modifiées
              reviews: uniqueReviews,
              offset: currentOffset + fetchedReviews.length, // Met à jour l'offset pour la prochaine requête
              isLoading: false,
              error: null,
              hasMore: hasMore, // Met à jour l'indicateur 'hasMore'
            },
          },
        };
      });

    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>; // Typage de l'erreur Axios
      console.error(`[ReviewStore] Erreur lors du fetch des reviews pour riddle ${riddleId}:`, axiosError.response?.data || axiosError.message);
      const message = axiosError.response?.data?.message || 'Erreur lors du chargement des reviews';

      // Met à jour l'état d'erreur pour ce riddle spécifique
      set((state) => ({
        reviewsByRiddle: {
          ...state.reviewsByRiddle,
          [riddleId]: {
            ...(state.reviewsByRiddle[riddleId] ?? defaultRiddleReviewState), // Assure que l'état existe
            isLoading: false,
            error: message,
          },
        },
      }));
    }
  },

  /**
   * Crée une nouvelle review pour une énigme spécifique.
   */
  createReview: async (riddleId: string, data: { content: string; rating: number; /* difficulty?: number */ }): Promise<Review | null> => {
    // On pourrait ajouter un état isLoading/error spécifique à la création si besoin
    try {
      // Appel POST à l'endpoint spécifique
      const response = await axios.post<Review>(`${API_URL}/riddles/${riddleId}/reviews`, data);
      const newReview = response.data;

      // Ajoute la nouvelle review au début de la liste dans l'état local
      set((state) => {
        const currentRiddleState = state.reviewsByRiddle[riddleId] ?? defaultRiddleReviewState;
        return {
          reviewsByRiddle: {
            ...state.reviewsByRiddle,
            [riddleId]: {
              ...currentRiddleState,
              // Ajoute au début pour une mise à jour immédiate de l'UI
              reviews: [newReview, ...currentRiddleState.reviews],
              // Optionnel: Faut-il incrémenter un compteur total ou ajuster l'offset ?
              // Pour l'instant, on suppose que le prochain fetch corrigera la pagination si nécessaire.
            },
          },
        };
      });
      return newReview; // Retourne la review créée

    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error(`[ReviewStore] Erreur lors de la création de la review pour riddle ${riddleId}:`, axiosError.response?.data || axiosError.message);
      // Gérer l'erreur (ex: retourner null, stocker l'erreur dans l'état)
      return null;
    }
  },

  /**
   * Met à jour une review existante.
   */
  updateReview: async (reviewId: number, data: Partial<{ content: string; rating: number; /* difficulty?: number */ }>): Promise<Review | null> => {
    try {
      // Appel PUT à un endpoint (supposé global ici, mais pourrait être imbriqué)
      const response = await axios.put<Review>(`${API_URL}/reviews/${reviewId}`, data);
      const updatedReview = response.data;

      // Met à jour la review dans l'état local
      set((state) => {
        const riddleId = updatedReview.riddle_id?.toString(); // Nécessite riddle_id dans la réponse
        if (!riddleId || !state.reviewsByRiddle[riddleId]) {
          console.warn(`[ReviewStore] Impossible de mettre à jour l'état pour la review ${reviewId}, riddleId ${riddleId} non trouvé.`);
          return {}; // Ne modifie pas l'état si on ne sait pas où mettre à jour
        }

        return {
          reviewsByRiddle: {
            ...state.reviewsByRiddle,
            [riddleId]: {
              ...state.reviewsByRiddle[riddleId]!, // On sait qu'il existe ici
              reviews: state.reviewsByRiddle[riddleId]!.reviews.map(review =>
                review.id === reviewId ? updatedReview : review // Remplace la review modifiée
              ),
            },
          },
        };
      });
      return updatedReview;

    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error(`[ReviewStore] Erreur lors de la mise à jour de la review ${reviewId}:`, axiosError.response?.data || axiosError.message);
      return null;
    }
  },

  /**
   * Supprime une review.
   */
  deleteReview: async (reviewId: number, riddleId: string): Promise<boolean> => {
    try {
      // Appel DELETE à un endpoint (supposé global ici)
      await axios.delete(`${API_URL}/reviews/${reviewId}`);

      // Supprime la review de l'état local
      set((state) => {
        const currentRiddleState = state.reviewsByRiddle[riddleId];
        if (!currentRiddleState) return {}; // Ne rien faire si l'état n'existe pas

        return {
          reviewsByRiddle: {
            ...state.reviewsByRiddle,
            [riddleId]: {
              ...currentRiddleState,
              reviews: currentRiddleState.reviews.filter(review => review.id !== reviewId), // Filtre la review supprimée
              // Optionnel: Décrémenter un compteur total ?
            },
          },
        };
      });
      return true; // Succès

    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error(`[ReviewStore] Erreur lors de la suppression de la review ${reviewId}:`, axiosError.response?.data || axiosError.message);
      return false; // Échec
    }
  },

  /**
   * Nettoie l'état des reviews pour une énigme spécifique (utile en quittant l'écran).
   */
  clearReviewsForRiddle: (riddleId: string) => {
     console.log(`[ReviewStore] Clearing state for riddle ${riddleId}`);
     set((state) => {
       const { [riddleId]: _, ...rest } = state.reviewsByRiddle; // Crée un nouvel objet sans la clé riddleId
       return { reviewsByRiddle: rest };
     });
  }

}));
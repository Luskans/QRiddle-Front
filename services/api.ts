import { CreatedRiddle, Riddle, RiddleDetail, RiddleFormData, RiddleItem } from '@/interfaces/riddle';
import api from '@/lib/axios';
import { Step, StepFormData, StepItem } from '@/interfaces/step';
import { Hint, HintFormData } from '@/interfaces/hint';
import { Review, ReviewFormData, ReviewItem, ReviewResponse } from '@/interfaces/review';
import { ActiveSession, CompleteSession, GameSession, PlayedSession, RiddleSession, ValidateStepResponse } from '@/interfaces/game';
import { Home } from '@/interfaces/home';
import { Leaderboard, LeaderboardResponse } from '@/interfaces/leaderboard';


export interface PaginatedListResponse<T> {
  items: T[];
  data: any;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}

// --- Riddles ---
export const getRiddles = async (): Promise<RiddleItem[]> => {
  const response = await api.get('/riddles');
  console.log('getRiddles :', response.data);
  return response.data.items;
};

export const getCreatedRiddles = async (page: number = 1, limit: number): Promise<PaginatedListResponse<CreatedRiddle>> => {
  const response = await api.get('/users/me/riddles/created', { params: { page, limit } });
  console.log('getCreatedRiddles :', response.data);
  return response.data;
};

export const getRiddleById = async (id: string): Promise<RiddleDetail> => {
  const response = await api.get(`/riddles/${id}`);
  console.log('getRiddle :', response.data);
  return response.data.data;
};

export const createRiddle = async (data: RiddleFormData): Promise<Riddle> => {
  const response = await api.post('/riddles', data);
  console.log('createRiddle :', response.data);
  return response.data.data;
};

export const updateRiddle = async (id: string, data: Partial<RiddleFormData>): Promise<Riddle> => {
  const response = await api.patch(`/riddles/${id}`, data);
  console.log('updateRiddle :', response.data);
  return response.data.data;
};

export const deleteRiddle = async (id: string): Promise<void> => {
  const response = await api.delete(`/riddles/${id}`);
  console.log('deleteRiddle :', response.data);
  return response.data;
};


// --- Steps ---
export const getStepById = async (id: string): Promise<StepItem> => {
  const response = await api.get(`/steps/${id}`);
  console.log('getStepById :', response.data);
  return response.data.data;
};

export const createStep = async (riddleId: string, data: StepFormData): Promise<Step> => {
  const response = await api.post(`/riddles/${riddleId}/steps`, data);
  console.log('createStep :', response.data);
  return response.data.data;
};

export const updateStep = async (id: string, data: Partial<StepFormData>): Promise<Step> => {
  const response = await api.patch(`/steps/${id}`, data);
  console.log('updateStep :', response.data);
  return response.data.data;
};

export const deleteStep = async (id: string): Promise<void> => {
  const response = await api.delete(`/steps/${id}`);
  console.log('deleteStep :', response.data);
  return response.data;
};


// --- Hints ---
export const createHint = async (stepId: string, data: HintFormData): Promise<Hint> => {
  const response = await api.post(`/steps/${stepId}/hints`, data);
  console.log('createHint :', response.data);
  return response.data.data;
};

export const updateHint = async (id: string, data: Partial<HintFormData>): Promise<Hint> => {
  const response = await api.patch(`/hints/${id}`, data);
  console.log('updateHint :', response.data);
  return response.data.data;
};

export const deleteHint = async (id: string): Promise<{ data: number }> => {
  const response = await api.delete(`/hints/${id}`);
  console.log('deleteHint :', response.data);
  return response.data.data;
};


// --- Reviews ---
export const getReviewsByRiddle = async (riddleId: string, page: number = 1, limit: number): Promise<PaginatedListResponse<ReviewItem>> => {
  const response = await api.get(`/riddles/${riddleId}/reviews`, { params: { page, limit }});
  console.log('getReviewsByRiddle :', response.data);
  return response.data;
};

export const getTopReviewsByRiddle = async (riddleId: string): Promise<ReviewItem[]> => {
  const response = await api.get(`/riddles/${riddleId}/reviews/top`);
  console.log('getTopReviewsByRiddle :', response.data);
  return response.data.items;
};

export const createReview = async (riddleId: string, data: ReviewFormData): Promise<Review> => {
  const response = await api.post(`/riddles/${riddleId}/reviews`, data);
  console.log('createReview :', response.data);
  return response.data.data;
};

export const updateReview = async (id: string, data: Partial<ReviewFormData>): Promise<Review> => {
  const response = await api.patch(`/reviews/${id}`, data);
  console.log('updateReview :', response.data);
  return response.data.data;
};

export const deleteReview = async (id: string): Promise<{ data: number }> => {
  const response = await api.delete(`/reviews/${id}`);
  console.log('deleteReview :', response.data);
  return response.data.data;
};


// --- Game-Session ---
export const getPlayedSessions = async (page: number = 1, limit: number): Promise<PaginatedListResponse<PlayedSession>> => {
  const response = await api.get(`/users/me/game-sessions`, { params: { page, limit } });
  console.log('getPlayedSessions :', response.data);
  return response.data;
};

export const getSessionByRiddle = async (riddleId: string): Promise<RiddleSession> => {
  const response = await api.get(`/riddles/${riddleId}/session`);
  console.log('getSessionByRiddle :', response.data);
  return response.data.data;
};

export const getActiveSession = async (id: string): Promise<ActiveSession> => {
  const response = await api.get(`/game/${id}`);
  console.log('getActiveSession :', response.data);
  return response.data.data;
};

export const getCompleteSession = async (id: string): Promise<CompleteSession> => {
  const response = await api.get(`/game/${id}/complete`);
  console.log('getCompleteSession :', response.data);
  return response.data.data;
};

export const validateStep = async (id: string, qr_code: string ): Promise<ValidateStepResponse> => {
  const response = await api.post(`/game/${id}/validate-step`, { qr_code });
  console.log('validateStep :', response.data);
  return response.data.data;
};

export const unlockHint = async (id: string, hint_order_number: number): Promise<GameSession> => {
  const response = await api.post(`/game/${id}/unlock-hint`, { hint_order_number });
  console.log('unlockHint :', response.data);
  return response.data.data;
};

export const playRiddle = async (riddleId: string, password: string): Promise<GameSession> => {
  const response = await api.post(`/riddles/${riddleId}/play`, { password });
  console.log('playRiddle :', response.data);
  return response.data.data;
};

export const abandonSession = async (id: string): Promise<GameSession> => {
  const response = await api.patch(`/game/${id}`);
  console.log('abandonSession :', response.data);
  return response.data.data;
};


// --- Home ---
export const getHome = async (): Promise<Home> => {
  const response = await api.get(`users/me/home`);
  console.log('getHome :', response.data);
  return response.data;
};


// --- Leaderboard ---
export const getTopGlobalLeaderboard = async (period: 'week' | 'month' | 'all'): Promise<LeaderboardResponse> => {
  const response = await api.get(`/leaderboards/global/top`, { params: { period } });
  console.log('getTopGlobalLeaderboard :', response.data);
  return response.data;
};

export const getTopRiddleLeaderboard = async (riddleId: string): Promise<LeaderboardResponse> => {
  const response = await api.get(`/leaderboards/riddles/${riddleId}/top`);
  console.log('getTopRiddleLeaderboard :', response.data);
  return response.data;
};

export const getGlobalLeaderboard = async (period: 'week' | 'month' | 'all', page: number = 1, limit: number): Promise<PaginatedListResponse<Leaderboard>> => {
  const response = await api.get(`/leaderboards/global`, { params: { period, page, limit }});
  console.log('getGlobalLeaderboard :', response.data);
  return response.data;
};

export const getRiddleLeaderboard = async (riddleId: string, page: number = 1, limit: number): Promise<PaginatedListResponse<Leaderboard>> => {
  const response = await api.get(`/leaderboards/riddles/${riddleId}`, { params: { page, limit }});
  console.log('getRiddleLeaderboard :', response.data);
  return response.data;
};
export interface ReviewItem {
  id: number;
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

export interface Review {
  id: number;
  riddle_id: number;
  user_id: number;
  content: string;
  rating: number;
  difficulty: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewFormData {
  content: string;
  rating: number;
  difficulty: number;
}

export interface ReviewResponse {
  items: ReviewItem[],
}
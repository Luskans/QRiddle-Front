export interface Review {
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

export interface ReviewFormData {
  content: string;
  rating: number;
  difficulty: number;
}

export interface ReviewResponse {
  items: Review[],
}
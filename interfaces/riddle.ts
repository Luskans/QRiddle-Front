export interface RiddleFormData {
  title: string;
  description: string;
  is_private: boolean;
  status?: 'published' | 'draft' | 'disabled';
  latitude: string;
  longitude: string;
}

export interface RiddleItem {
  id: number;
  riddle_id: number;
  title: string;
  is_private: boolean;
  status: 'published' | 'draft' | 'disabled';
  latitude: string;
  longitude: string;
  updated_at: string;
  steps_count: number;
  reviews_count: number;
  reviews_avg_rating: number;
  reviews_avg_difficulty: number;
}

export interface CreatedRiddle {
  id: number;
  title: string;
  status: 'published' | 'draft' | 'disabled';
  is_private: boolean;
  latitude: string;
  longitude: string;
  updated_at: string;
}

export interface RiddleDetail {
  id: number;
  title: string;
  description: string;
  is_private: boolean;
  status: 'published' | 'draft' | 'disabled';
  latitude: string;
  longitude: string;
  updated_at: string;
  stepsCount: number;
  reviewsCount: number;
  averageRating: number;
  averageDifficulty: number;
  password?: string;
  creator: {
    id: number;
    name: string;
    image: string;
  }
  steps: StepItem[]
}

export interface Riddle {
  id: number;
  riddle_id: number;
  creator_id: number;
  title: string;
  description: string;
  is_private: boolean;
  status: 'published' | 'draft' | 'disabled';
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
}

export interface StepItem {
  id: number;
  order_number: number;
  qr_code: string;
}
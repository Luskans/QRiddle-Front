export interface Review {
  id: number;
  user_id: number;
  riddle_id: number;
  content: string;
  rating: number;
  created_at: string;
  updated_at: string;
}
export interface Hint {
  id: number;
  step_id: number;
  order_number: number;
  type: 'text' | 'image' | 'audio';
  content: string;
  created_at: string;
  updated_at: string;
}

export interface HintFormData {
  type: 'text' | 'image' | 'audio';
  content: string;
}
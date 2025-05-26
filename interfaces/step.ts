export interface Step {
  id: number;
  riddle_id: number;
  order_number: number;
  qr_code: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
}

export interface StepFormData {
  latitude: string;
  longitude: string;
}
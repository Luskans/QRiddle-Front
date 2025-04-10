import { Hint } from "./hint";

export interface Step {
  id: number;
  order_number: number;
  qr_code: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  hints: Hint[];
}
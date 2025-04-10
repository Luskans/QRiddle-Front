import { Step } from "./step";

export interface Riddle {
  id: number;
  title: string;
  description: string;
  is_private: boolean;
  status: 'active' | 'draft' | 'disabled';
  created_at: string;
  updated_at: string;
  difficulty: number;
  latitude: string;
  longitude: string;
  steps: Step[];
}
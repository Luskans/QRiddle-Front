import { Hint } from "./hint";

export interface PlayedSession {
  id: number;
  riddle_id: number;
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  riddle: {
    id: number;
    title: string;
    latitude: string;
    longitude: string;
  }
}

export interface RiddleSession {
  id: number;
  status: 'active' | 'completed' | 'abandoned';
  session_steps: {
    id: number;
    game_session_id: number;
    status: 'active' | 'completed' | 'abandoned';
    start_time: string;
    end_time: string;
  }[];
}

export interface ActiveSession {
  session_step: {
    id: number;
    start_time: string;
    extra_hints: number;
  };
  step: {
    id: number;
    order_number: number;
  }
  hints: {
    id: number;
    order_number: number;
    type: 'text' | 'audio' | 'image';
    content: string;
    unlocked: boolean;
  }[];
  stepsCount: number;
}

export interface CompleteSession {
  id: number;
  riddle_id: number;
  score: number;
  duration: string;
  session_steps: {
    id: number;
    game_session_id: number;
    start_time: string;
    end_time: string;
    extra_hints: number;
  }[];
}

export interface GameSession {
  id: number;
  riddle_id: number;
  user_id: number;
  status: 'active' | 'completed' | 'abandoned';
  score: number;
  created_at: string;
  updated_at: string;
}

export interface ValidateStepResponse {
  game_completed: boolean;
  game_session: GameSession;
}

// export interface NewSessionFormData {
//   password: string;
// }

// export interface ValidateStepFormData {
//   qr_code: string;
//   // TODO: rajouter localisation pour code métier ?
// }

// export interface UnlockHintFormData {
//   hintId: number;
// }
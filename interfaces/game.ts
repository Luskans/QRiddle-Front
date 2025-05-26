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
  sessionId: number;
  currentSessionStep: {
    id: number;
    start_time: string;
    step: {
      id: number;
      order_number: number;
    }
  };
  hints: {
    id: number;
    type: 'text' | 'image' | 'audio';
    content: string;
  };
}

export interface NewSessionFormData {
  password: string;
}

export interface ValidateStepFormData {
  qr_code: string;
  // TODO: rajouter localisation pour code métier ?
}

export interface UnlockHintFormData {
  hintId: number;
}
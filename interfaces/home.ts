export interface Home {
  createdCount: number;
  playedCount: number;
  activeGameSession: ActiveGameSession | null
}

export interface ActiveGameSession {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
  created_at: string;
  currentStep: number;
  stepsCount: number;
}
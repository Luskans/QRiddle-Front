import { create } from 'zustand';
import axios from 'axios';
import { GameSession } from './useGameSessionStore'; // Importer l'interface
import { GlobalLeaderboardEntry } from './useLeaderboardStore'; // Importer l'interface

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface DashboardStats {
  created_riddles_count: number;
  played_games_count: number;
  // unread_notifications_count?: number;
}

interface LeaderboardSnippet {
  week: GlobalLeaderboardEntry[];
  month: GlobalLeaderboardEntry[];
  all: GlobalLeaderboardEntry[];
}

interface DashboardData {
  stats: DashboardStats | null;
  active_session: GameSession | null; // Utiliser l'interface de GameSessionStore
  leaderboard_snippet: LeaderboardSnippet | null;
  // latest_notifications?: any[]; // Adaptez le type
}

interface DashboardState extends DashboardData {
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  active_session: null,
  leaderboard_snippet: null,
  // latest_notifications: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<DashboardData>(`${API_URL}/dashboard`);
      set({
        stats: response.data.stats,
        active_session: response.data.active_session,
        leaderboard_snippet: response.data.leaderboard_snippet,
        // latest_notifications: response.data.latest_notifications,
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Erreur fetch dashboard data:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Erreur chargement du tableau de bord";
      set({ isLoading: false, error: message, stats: null, active_session: null, leaderboard_snippet: null }); // Reset data on error
    }
  },
}));
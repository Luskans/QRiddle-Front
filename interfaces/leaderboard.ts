export interface Leaderboard {
  id: number;
  score: number;
  user_id: number;
  user: {
    id: number;
    name: string;
    image: string;
  }
}

export interface UserInfos {
  userRank: number;
  userScore: number;
}

export interface LeaderboardResponse {
  items: Leaderboard[],
  data: UserInfos
}
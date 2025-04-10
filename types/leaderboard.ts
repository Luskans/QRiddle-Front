export interface GlobalRanking {
  globalRanking: {
    week: Ranking[];
    month: Ranking[];
    all: Ranking[];
  }
}

export interface GlobalUserRank {
  globalUserRank: {
    week: UserRank | null;
    month: UserRank | null;
    all: UserRank | null;
  }
}

export interface GameRanking {
  gameRanking: Ranking[]; 
}

export interface GameUserRank {
  gameUserRank: UserRank;
}

export interface Ranking {
  name: string;
  image: string;
  score: number;
}

export interface UserRank {
  score: number;
  rank: number;
}
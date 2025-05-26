import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getGlobalLeaderboard, getRiddleLeaderboard, getTopGlobalLeaderboard, getTopRiddleLeaderboard } from '@/services/api';


export function useTopGlobalLeaderboard(period: 'week' | 'month' | 'all') {
  return useQuery({
    queryKey: ['top-global-leaderboard', period],
    queryFn: () => getTopGlobalLeaderboard(period),
    enabled: !!period,
  });
}

export function useTopRiddleLeaderboard(riddleId: string) {
  return useQuery({
    queryKey: ['top-riddle-leaderboard', riddleId],
    queryFn: () => getTopRiddleLeaderboard(riddleId),
    enabled: !!riddleId,
  });
}

export function useGlobalLeaderboard(period: 'week' | 'month' | 'all', limit: number) {
  return useInfiniteQuery({
    queryKey: ['global-leaderboard', period, limit],
    queryFn: ({ pageParam = 1 }) => getGlobalLeaderboard(period, pageParam, limit),
    initialPageParam: 1,
    enabled: !!period,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? +lastPage.page + 1 : undefined;
    }
  });
}

export function useRiddleLeaderboard(riddleId: string, limit: number) {
  return useInfiniteQuery({
    queryKey: ['riddle-leaderboard', riddleId, limit],
    queryFn: ({ pageParam = 1 }) => getRiddleLeaderboard(riddleId, pageParam, limit),
    initialPageParam: 1,
    enabled: !!riddleId,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? +lastPage.page + 1 : undefined;
    }
  });
}
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { abandonSession, getActiveSession, getPlayedSessions, getSessionByRiddle, newSession, unlockHint, validateStep } from '@/services/api';


export function usePlayedSessions(limit: number) {
  return useInfiniteQuery({
    queryKey: ['played-sessions', limit],
    queryFn: ({ pageParam = 1 }) => getPlayedSessions(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? +lastPage.page + 1 : undefined;
    }
  });
}

export function useSessionByRiddle(riddleId: string) {
  return useQuery({
    queryKey: ['riddle-session', riddleId],
    queryFn: () => getSessionByRiddle(riddleId),
    enabled: !!riddleId,
  });
}

export function useActiveSession(id: string) {
  return useQuery({
    queryKey: ['active-session', id],
    queryFn: () => getActiveSession(id),
    enabled: !!id,
  });
}

export function useValidateStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: ValidateStepFormData }) => validateStep(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      queryClient.invalidateQueries({ queryKey: ['riddle-session'] });
      queryClient.invalidateQueries({ queryKey: ['played-sessions'] });
    },
  });
}

export function useUnlockHint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: UnlockHintFormData }) => unlockHint(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
    },
  });
}

export function useNewSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ riddleId, data }: { riddleId: string, data: NewSessionFormData }) => newSession(riddleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      queryClient.invalidateQueries({ queryKey: ['riddle-session'] });
      queryClient.invalidateQueries({ queryKey: ['played-sessions'] });
    },
  });
}

export function useAbandonSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => abandonSession(id),
    onSuccess: (updatedSession) => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      queryClient.invalidateQueries({ queryKey: ['riddle-session'] });
      queryClient.invalidateQueries({ queryKey: ['played-sessions'] });
    },
  });
}

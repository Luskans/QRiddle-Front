import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { abandonRiddle, abandonSession, getActiveSession, getCompleteSession, getPlayedSessions, getSessionByRiddle, newSession, playRiddle, unlockHint, validateStep } from '@/services/api';


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

export function useCompleteSession(id: string) {
  return useQuery({
    queryKey: ['complete-session', id],
    queryFn: () => getCompleteSession(id),
    enabled: !!id,
  });
}

export function useValidateStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, qr_code }: { id: string, qr_code: string }) => validateStep(id, qr_code),
    onSuccess: (validateStepResponse) => {
      queryClient.refetchQueries({ queryKey: ['active-session', validateStepResponse.game_session.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['riddle-session', validateStepResponse.game_session.riddle_id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
}

export function useUnlockHint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hint_order_number }: { id: string, hint_order_number: number }) => unlockHint(id, hint_order_number),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['active-session', variables.id] });
    },
  });
}

export function usePlayRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ riddleId, password }: { riddleId: string, password: string }) => playRiddle(riddleId, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      queryClient.invalidateQueries({ queryKey: ['riddle-session'] });
      queryClient.invalidateQueries({ queryKey: ['played-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
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
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
}

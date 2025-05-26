import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createHint, deleteHint, getHintsByStep, updateHint } from '@/services/api';


export function useHintsByStep(stepId: string) {
  return useQuery({
    queryKey: ['step-hints', stepId],
    queryFn: () => getHintsByStep(stepId),
    enabled: !!stepId,
  });
}

export function useCreateHint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stepId, data }: { stepId: string, data: HintFormData }) => createHint(stepId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hints', variables.stepId] });
    },
  });
}

export function useUpdateHint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HintFormData> }) => updateHint(id, data),
    onSuccess: (updatedHint) => {
      queryClient.invalidateQueries({ queryKey: ['hints', updatedHint.stepId] });
    },
  });
}

export function useDeleteHint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteHint(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['hints'] });
    },
  });
}
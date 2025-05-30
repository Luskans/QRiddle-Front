import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHint, deleteHint, updateHint } from '@/services/api';
import { HintFormData } from '@/interfaces/hint';


export function useCreateHint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stepId, data }: { stepId: string, data: HintFormData }) => createHint(stepId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['step', variables.stepId] });
    },
  });
}

export function useUpdateHint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HintFormData> }) => updateHint(id, data),
    onSuccess: (updatedHint) => {
      queryClient.refetchQueries({ queryKey: ['step', updatedHint.step_id.toString()] });
    },
  });
}

export function useDeleteHint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteHint(id),
    onSuccess: (stepId) => {
      queryClient.refetchQueries({ queryKey: ['step', stepId.toString()] });
    },
  });
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createHint, deleteHint, getHintById, getHintsByStep, updateHint } from '@/services/api';
import { HintFormData } from '@/interfaces/hint';


// export function useHintsByStep(stepId: string) {
//   return useQuery({
//     queryKey: ['step-hints', stepId],
//     queryFn: () => getHintsByStep(stepId),
//     enabled: !!stepId,
//   });
// }

// export function useHint(id: string) {
//   return useQuery({
//     queryKey: ['hint', id],
//     queryFn: () => getHintById(id),
//     enabled: !!id,
//   });
// }

export function useCreateHint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stepId, data }: { stepId: string, data: HintFormData }) => createHint(stepId, data),
    onSuccess: (_, variables) => {
      // queryClient.invalidateQueries({ queryKey: ['hints', variables.stepId] });
      queryClient.invalidateQueries({ queryKey: ['step', variables.stepId] });
    },
  });
}

export function useUpdateHint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HintFormData> }) => updateHint(id, data),
    onSuccess: (updatedHint) => {
      // queryClient.invalidateQueries({ queryKey: ['hints', updatedHint.stepId] });
      queryClient.refetchQueries({ queryKey: ['step', updatedHint.step_id.toString()] });
    },
  });
}

export function useDeleteHint() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteHint(id),
    onSuccess: (stepId) => {
      console.log("dans mutate", stepId)
      // queryClient.invalidateQueries({ queryKey: ['hints'] });
      queryClient.refetchQueries({ queryKey: ['step', stepId.toString()] });
    },
  });
}
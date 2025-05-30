import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createStep, deleteStep, getStepById, updateStep } from '@/services/api';
import { StepFormData } from '@/interfaces/step';


export function useStep(id: string) {
  return useQuery({
    queryKey: ['step', id],
    queryFn: () => getStepById(id),
    enabled: !!id,
  });
}

export function useCreateStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ riddleId, data }: { riddleId: string, data: StepFormData }) => createStep(riddleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['riddle', variables.riddleId] });
    },
  });
}

export function useUpdateStep() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StepFormData> }) => updateStep(id, data),
    onSuccess: (updatedStep) => {
      queryClient.refetchQueries({ queryKey: ['step', updatedStep.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['riddle', updatedStep.riddle_id.toString()] });
    },
  });
}

export function useDeleteStep() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteStep(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['step', id] });
    },
  });
}
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getRiddles, getCreatedRiddles, getRiddleById, createRiddle, updateRiddle, deleteRiddle } from '@/services/api';
import { CreateRiddleFormData, RiddleFormData } from '@/interfaces/riddle';


export function useRiddles() {
  return useQuery({
    queryKey: ['riddles'],
    queryFn: getRiddles,
  });
}

export function useCreatedRiddles(limit: number) {
  return useInfiniteQuery({
    queryKey: ['created-riddles', limit],
    queryFn: ({ pageParam = 1 }) => getCreatedRiddles(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? +lastPage.page + 1 : undefined;
    }
  });
}

export function useRiddle(id: string) {
  return useQuery({
    queryKey: ['riddle', id],
    queryFn: () => getRiddleById(id),
    enabled: !!id,
  });
}

export function useCreateRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RiddleFormData) => createRiddle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riddles'] });
      queryClient.invalidateQueries({ queryKey: ['created-riddles'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
}

export function useUpdateRiddle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RiddleFormData> }) => updateRiddle(id, data),
    onSuccess: (updatedRiddle) => {
      queryClient.refetchQueries({ queryKey: ['riddle', updatedRiddle.id.toString()] });
      // queryClient.setQueryData(['riddle', updatedRiddle.data.id.toString()], updatedRiddle);
      queryClient.invalidateQueries({ queryKey: ['riddles'] });
      queryClient.invalidateQueries({ queryKey: ['created-riddles'] });
    },
  });
}

export function useDeleteRiddle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteRiddle(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['riddle', id] });
      queryClient.invalidateQueries({ queryKey: ['riddles'] });
      queryClient.invalidateQueries({ queryKey: ['created-riddles'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });
}
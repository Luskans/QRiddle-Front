import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { createReview, deleteReview, getReviewsByRiddle, getTopReviewsByRiddle, updateReview } from '@/services/api';
import { ReviewFormData } from '@/interfaces/review';


export function useReviewsByRiddle(riddleId: string, limit: number) {
  return useInfiniteQuery({
    queryKey: ['riddle-reviews', riddleId, limit],
    queryFn: ({ pageParam = 1 }) => getReviewsByRiddle(riddleId, pageParam, limit),
    initialPageParam: 1,
    enabled: !!riddleId,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? +lastPage.page + 1 : undefined;
    }
  });
}

export function useTopReviewsByRiddle(riddleId: string) {
  return useQuery({
    queryKey: ['top-riddle-reviews', riddleId],
    queryFn: () => getTopReviewsByRiddle(riddleId),
    enabled: !!riddleId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ riddleId, data }: { riddleId: string, data: ReviewFormData }) => createReview(riddleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['top-riddle-reviews', variables.riddleId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['riddle-reviews', variables.riddleId.toString()] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ReviewFormData> }) => updateReview(id, data),
    onSuccess: (updatedReview) => {
      queryClient.invalidateQueries({ queryKey: ['top-riddle-reviews', updatedReview.riddle_id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['riddle-reviews', updatedReview.riddle_id.toString()] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: (riddleId) => {
      queryClient.invalidateQueries({ queryKey: ['top-riddle-reviews', riddleId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['riddle-reviews', riddleId.toString()] });
    },
  });
}
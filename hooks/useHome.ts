import { useQuery } from '@tanstack/react-query';
import { getHome } from '@/services/api';


export function useHome() {
  return useQuery({
    queryKey: ['home'],
    queryFn: getHome,
  });
}
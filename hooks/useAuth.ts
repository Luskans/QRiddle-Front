import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { initialize, login, logout, register } from '@/services/api';
import { LoginFormData, RegisterFormData } from '@/interfaces/auth';
import { useAuthStore } from '@/stores/useAuthStore2';


export function useInitialize() {
  const { initialize } = useAuthStore();

  return useQuery({
    queryKey: ['initialize'],
    queryFn: async () => {
      const isAuthenticated = await initialize();
      if (isAuthenticated) {
        return await getUser();
      }
      throw new Error('Not authenticated');
    },
    retry: false,
    enabled: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: async (data) => {
      await setAuth(data.token, data.user);
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['initialize'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterFormData) => register(data),
    onSuccess: async (data) => {
      await setAuth(data.token, data.user);
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['initialize'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      await clearAuth();
      queryClient.clear();
    },
    onError: async () => {
      await clearAuth();
      queryClient.clear();
    }
  });
}
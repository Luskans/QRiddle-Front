import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, register } from '@/services/api';


export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) => login(data),
    onSuccess: () => {
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterFormData) => register(data),
    onSuccess: () => {
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
    },
  });
}
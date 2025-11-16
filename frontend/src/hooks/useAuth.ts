import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../state/auth';
import { authApi } from '../api/auth';
import { LoginRequest, RegisterRequest } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout, setLoading } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.access_token, data.refresh_token);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.user, data.access_token, data.refresh_token);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
    },
  });

  const handleLogin = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterRequest) => {
    registerMutation.mutate(data);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
};
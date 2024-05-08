import { axios } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/utils/storage';
import { useUserStore } from '@/stores/user';
import { ProductRoutes } from '@/features/products/routes/constants';
import { AccessModel } from '../types';

export type LoginCredentialsDTO = {
  username: string;
  password: string;
};

function loginWithUsernameAndPassword(payload: LoginCredentialsDTO) {
  return axios.post<AccessModel>('/auth/login', payload);
}

function useLogin() {
  const navigate = useNavigate();
  const { setToken, setIsLoggedIn } = useUserStore();

  return useMutation({
    mutationFn: loginWithUsernameAndPassword,
    mutationKey: ['login-action'],
    onSuccess: ({ data }) => {
      storage.setToken(data.accessToken);
      setToken(data.accessToken);
      setIsLoggedIn(true);
      navigate(ProductRoutes.List);
    },
  });
}

export { loginWithUsernameAndPassword, useLogin };

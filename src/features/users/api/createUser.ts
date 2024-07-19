import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { UserModel } from '@/features/auth/types';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { BaseEntity } from '@/types/common';

export type Payload = Omit<UserModel, keyof BaseEntity | 'lastLogin'> & { password: string };

async function createUser(payload: Payload) {
  return axios.post<UserModel>('/users', payload);
}

type UseCreateUser = {
  config?: MutationConfig<typeof createUser>;
};

function useCreateUser({ config }: UseCreateUser = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-user'],
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-user']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Usuário criado.',
      });
      navigate(-1);
    },
  });
}

export { createUser, useCreateUser };

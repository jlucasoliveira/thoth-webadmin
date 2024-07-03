import { useMutation } from '@tanstack/react-query';
import { UserModel } from '@/features/auth/types';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { Payload } from './createUser';

type PartialUpdate = {
  id: string;
  payload: Partial<Payload>;
};

function userPartialUpdate(params: PartialUpdate) {
  delete params.payload.password;
  return axios.patch<UserModel>(`/users/${params.id}`, params.payload);
}

type UseUserPartialUpdate = {
  config?: MutationConfig<typeof userPartialUpdate>;
  forAttribute?: boolean;
};

function useUserPartialUpdate({ config, forAttribute }: UseUserPartialUpdate = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: userPartialUpdate,
    onSuccess: () => {
      if (forAttribute) queryClient.refetchQueries(['fetch-users']);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Usuário atualizado',
      });
    },
  });
}

export { userPartialUpdate, useUserPartialUpdate };

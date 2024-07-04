import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

async function deleteUser(id: string) {
  return axios.delete(`/users/${id}`);
}

type UseDeleteUser = {
  config?: MutationConfig<typeof deleteUser>;
};

// TODO: When needed, filter old users
function useDeleteUser({ config }: UseDeleteUser = {}) {
  const { addNotification } = useNotificationStore();
  return useMutation({
    ...config,
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-users']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Usuário removido com sucesso!',
      });
    },
  });
}

export { deleteUser, useDeleteUser };

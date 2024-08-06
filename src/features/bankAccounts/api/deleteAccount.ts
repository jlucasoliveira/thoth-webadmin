import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

async function deleteAccount(id: string) {
  return axios.delete(`/bank-accounts/${id}`);
}

type UseDeleteAccount = {
  config?: MutationConfig<typeof deleteAccount>;
};

function useDeleteAccount({ config }: UseDeleteAccount = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (id) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-accounts']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Conta bancária removida com sucesso!',
      });
    },
  });
}

export { deleteAccount, useDeleteAccount };

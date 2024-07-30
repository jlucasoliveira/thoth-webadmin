import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

async function deleteClient(id: string) {
  return axios.delete(`/clients/${id}`);
}

type UseDeleteClient = {
  config?: MutationConfig<typeof deleteClient>;
};

function useDeleteClient({ config }: UseDeleteClient = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (id) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-clients']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Cliente removido com sucesso!',
      });
    },
  });
}

export { deleteClient, useDeleteClient };

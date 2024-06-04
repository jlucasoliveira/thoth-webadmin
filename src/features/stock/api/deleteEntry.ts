import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

type Params = {
  id: string;
  variationId: string;
};

async function deleteEntry(params: Params) {
  return axios.delete(`/variations/${params.variationId}/stock/entries/${params.id}`);
}

type UseDeleteEntry = {
  config?: MutationConfig<typeof deleteEntry>;
};

function useDeleteEntry({ config }: UseDeleteEntry = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (id) => deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-entries']);
      queryClient.invalidateQueries(['fetch-stock']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Entrada removida com sucesso!',
      });
    },
  });
}

export { deleteEntry, useDeleteEntry };

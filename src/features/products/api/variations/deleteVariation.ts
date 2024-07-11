import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

type Params = {
  productId: number;
  id: string;
};

async function deleteVariation({ id, productId }: Params) {
  return axios.delete(`/products/${productId}/variations/${id}`);
}

type UseDeleteVariation = {
  config?: MutationConfig<typeof deleteVariation>;
};

function useDeleteVariation({ config }: UseDeleteVariation = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (params) => deleteVariation(params),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-variations']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Variação removida com sucesso!',
      });
    },
  });
}

export { deleteVariation, useDeleteVariation };

import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

async function deleteProduct(id: string) {
  return axios.delete(`/products/${id}`);
}

type UseDeleteProduct = {
  config?: MutationConfig<typeof deleteProduct>;
};

function useDeleteProduct({ config }: UseDeleteProduct = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-products']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Produto removido com sucesso!',
      });
    },
  });
}

export { deleteProduct, useDeleteProduct };

import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { Payload } from './createProduct';
import { ProductModel } from '../types';

type PartialUpdate = {
  id: string;
  payload: Partial<Payload>;
};

function productPartialUpdate(params: PartialUpdate) {
  return axios.patch<ProductModel>(`/products/${params.id}`, params.payload);
}

type UseProductPartialUpdate = {
  config?: MutationConfig<typeof productPartialUpdate>;
  forAttribute?: boolean;
};

function useProductPartialUpdate({ config, forAttribute }: UseProductPartialUpdate = {}) {
  const { addNotification } = useNotificationStore();
  return useMutation({
    ...config,
    mutationFn: (params) => productPartialUpdate(params),
    mutationKey: ['product-partial-update'],
    onSuccess: () => {
      if (forAttribute) queryClient.refetchQueries(['fetch-products']);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Produto atualizado',
      });
    },
  });
}

export { productPartialUpdate, useProductPartialUpdate };

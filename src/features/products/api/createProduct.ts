import { useMutation } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router-dom';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { BaseEntity } from '@/types/common';
import { ProductRoutes } from '../routes/constants';
import { ProductModel } from '../types';

export type Payload = Omit<ProductModel, keyof BaseEntity | 'brand' | 'variations'>;

async function createProduct(payload: Payload) {
  const { data } = await axios.post<ProductModel>(`/products`, payload);
  return data;
}

type UseCreateProduct = {
  config?: MutationConfig<typeof createProduct>;
};

function useCreateProduct({ config }: UseCreateProduct = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-product'],
    mutationFn: (payload) => createProduct(payload),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries(['fetch-products']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Produto criado.',
      });
      navigate(generatePath(ProductRoutes.Edit, { id: id.toString() }));
    },
  });
}

export { createProduct, useCreateProduct };

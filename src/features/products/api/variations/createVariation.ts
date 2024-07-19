import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { BaseEntity } from '@/types/common';
import { ProductVariationModel } from '../../types';

export type Payload = Omit<
  ProductVariationModel,
  keyof BaseEntity | 'product' | 'stock' | 'categories'
> & {
  quantity?: number;
  costPrice?: number;
  categories: number[];
};

async function createVariation(params: Payload) {
  const { productId, ...payload } = params;
  const { data } = await axios.post<ProductVariationModel[]>(
    `/products/${productId}/variations`,
    payload
  );
  return data;
}

type UseCreateVariation = {
  config?: MutationConfig<typeof createVariation>;
};

function useCreateVariation({ config }: UseCreateVariation = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-variation'],
    mutationFn: (payload) => createVariation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-variations']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Variação criada.',
      });
    },
  });
}

export { createVariation, useCreateVariation };

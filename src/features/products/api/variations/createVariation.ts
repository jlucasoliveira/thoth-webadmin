import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { BaseEntity } from '@/types/common';
import { ProductVariationModel } from '../../types';

export type Payload = Omit<ProductVariationModel, keyof BaseEntity | 'product'>;

async function createVariation(params: Payload) {
  const { productId, ...payload } = params;
  const { data } = await axios.post<ProductVariationModel>(
    `/products/${productId}/variations`,
    payload
  );
  return data;
}

type UseCreateVariation = {
  config?: MutationConfig<typeof createVariation>;
};

function useCreateVariation({ config }: UseCreateVariation = {}) {
  const navigate = useNavigate();
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
      navigate(-1);
    },
  });
}

export { createVariation, useCreateVariation };

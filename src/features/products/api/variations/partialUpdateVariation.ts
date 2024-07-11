import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { Payload } from './createVariation';
import { ProductVariationModel } from '../../types';

export type PartialUpdate = {
  id: string;
  productId: number;
  payload: Partial<Omit<Payload, 'productId'>>;
};

async function variationPartialUpdate(params: PartialUpdate) {
  const { data } = await axios.patch<ProductVariationModel>(
    `/products/${params.productId}/variations/${params.id}`,
    params.payload
  );
  return data;
}

type UseVariationPartialUpdate = {
  config?: MutationConfig<typeof variationPartialUpdate>;
  forAttribute?: boolean;
};

function useVariationPartialUpdate({ config, forAttribute }: UseVariationPartialUpdate = {}) {
  const { addNotification } = useNotificationStore();
  return useMutation({
    ...config,
    mutationFn: (params) => variationPartialUpdate(params),
    mutationKey: ['variation-partial-update'],
    onSuccess: () => {
      if (forAttribute) queryClient.refetchQueries(['fetch-variations']);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Variação atualizado',
      });
    },
  });
}

export { variationPartialUpdate, useVariationPartialUpdate };

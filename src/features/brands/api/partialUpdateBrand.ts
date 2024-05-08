import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { Payload } from './createBrand';
import { BrandModel } from '../types';

type PartialUpdate = {
  id: string;
  payload: Partial<Payload>;
};

function brandPartialUpdate(params: PartialUpdate) {
  return axios.patch<BrandModel>(`/brands/${params.id}`, params.payload);
}

type UseBrandPartialUpdate = {
  config?: MutationConfig<typeof brandPartialUpdate>;
  forAttribute?: boolean;
};

function useBrandPartialUpdate({ config, forAttribute }: UseBrandPartialUpdate = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (params) => brandPartialUpdate(params),
    mutationKey: ['brand-partial-update'],
    onSuccess: () => {
      if (forAttribute) queryClient.refetchQueries(['fetch-brands']);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Marca atualizada',
      });
    },
  });
}

export { brandPartialUpdate, useBrandPartialUpdate };

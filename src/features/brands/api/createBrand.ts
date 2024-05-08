import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { BrandModel } from '../types';

export type Payload = Pick<BrandModel, 'name' | 'profitRate'>;

async function createBrand(payload: Payload) {
  return axios.post<BrandModel>(`/brands`, payload);
}

type UseCreateBrand = {
  config?: MutationConfig<typeof createBrand>;
};

function useCreateBrand({ config }: UseCreateBrand = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-brand'],
    mutationFn: (payload) => createBrand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-brands']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Marca criada.',
      });
      navigate(-1);
    },
  });
}

export { createBrand, useCreateBrand };

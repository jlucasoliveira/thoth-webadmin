import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { Payload } from './createClient';
import { ClientRoutes } from '../routes/constants';
import { ClientModel } from '../types';

type PartialUpdate = {
  id: string;
  payload: Partial<Payload>;
};

function clientPartialUpdate(params: PartialUpdate) {
  return axios.patch<ClientModel>(`/clients/${params.id}`, params.payload);
}

type UseClientPartialUpdate = {
  config?: MutationConfig<typeof clientPartialUpdate>;
  forAttribute?: boolean;
};

function useClientPartialUpdate({ config, forAttribute }: UseClientPartialUpdate = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (params) => clientPartialUpdate(params),
    mutationKey: ['client-partial-update'],
    onSuccess: () => {
      if (forAttribute) queryClient.refetchQueries(['fetch-clients']);
      else navigate(ClientRoutes.List);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Cliente atualizado',
      });
    },
  });
}

export { clientPartialUpdate, useClientPartialUpdate };

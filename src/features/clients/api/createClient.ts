import { useMutation } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router-dom';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { BaseEntity } from '@/types/common';
import { ClientRoutes } from '../routes/constants';
import { ClientModel } from '../types';

export type Payload = Omit<ClientModel, keyof BaseEntity | 'isDefault' | 'purchases'>;

async function createClient(payload: Payload) {
  const { data } = await axios.post<ClientModel>(`/clients`, payload);
  return data;
}

type UseCreateClient = {
  config?: MutationConfig<typeof createClient>;
};

function useCreateClient({ config }: UseCreateClient = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-client'],
    mutationFn: (payload) => createClient(payload),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries(['fetch-clients']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Ciente criado.',
      });
      navigate(generatePath(ClientRoutes.Edit, { id }));
    },
  });
}

export { createClient, useCreateClient };

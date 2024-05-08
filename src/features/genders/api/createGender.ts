import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { GenderModel } from '../types';

export type Payload = Pick<GenderModel, 'name'>;

async function createGender(payload: Payload) {
  return axios.post<GenderModel>(`/genders`, payload);
}

type UseCreateGender = {
  config?: MutationConfig<typeof createGender>;
};

function useCreateGender({ config }: UseCreateGender = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-gender'],
    mutationFn: (payload) => createGender(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-genders']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Gênero criada.',
      });
      navigate(-1);
    },
  });
}

export { createGender, useCreateGender };

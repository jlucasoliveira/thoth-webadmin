import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { GenderModel } from '../types';
import { Payload } from './createGender';

type PartialUpdate = {
  id: string;
  payload: Partial<Payload>;
};

function genderPartialUpdate(params: PartialUpdate) {
  return axios.patch<GenderModel>(`/genders/${params.id}`, params.payload);
}

type UseGenderPartialUpdate = {
  config?: MutationConfig<typeof genderPartialUpdate>;
  forAttribute?: boolean;
};

function useGenderPartialUpdate({ config, forAttribute }: UseGenderPartialUpdate = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (params) => genderPartialUpdate(params),
    mutationKey: ['gender-partial-update'],
    onSuccess: () => {
      if (forAttribute) queryClient.refetchQueries(['fetch-genders']);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Gênero atualizado',
      });
    },
  });
}

export { genderPartialUpdate, useGenderPartialUpdate };

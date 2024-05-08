import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { CategoryModel } from '../types';

export type Payload = Pick<CategoryModel, 'name'>;

async function createCategory(payload: Payload) {
  return axios.post<CategoryModel>(`/categories`, payload);
}

type UseCreateCategory = {
  config?: MutationConfig<typeof createCategory>;
};

function useCreateCategory({ config }: UseCreateCategory = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-category'],
    mutationFn: (payload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-categories']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Categoria criada.',
      });
      navigate(-1);
    },
  });
}

export { createCategory, useCreateCategory };

import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { CategoryModel } from '../types';
import { Payload } from './createCategory';

type PartialUpdate = {
  id: string;
  payload: Partial<Payload>;
};

function categoryPartialUpdate(params: PartialUpdate) {
  return axios.patch<CategoryModel>(`/categories/${params.id}`, params.payload);
}

type UseCategoryPartialUpdate = {
  config?: MutationConfig<typeof categoryPartialUpdate>;
  forAttribute?: boolean;
};

function useCategoryPartialUpdate({ config, forAttribute }: UseCategoryPartialUpdate = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (params) => categoryPartialUpdate(params),
    mutationKey: ['category-partial-update'],
    onSuccess: () => {
      if (forAttribute) queryClient.refetchQueries(['fetch-categories']);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Categoria atualizada',
      });
    },
  });
}

export { categoryPartialUpdate, useCategoryPartialUpdate };

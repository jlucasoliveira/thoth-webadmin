import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

async function deleteCategory(id: string) {
  return axios.delete(`/categories/${id}`);
}

type UseDeleteCategory = {
  config?: MutationConfig<typeof deleteCategory>;
};

function useDeleteCategory({ config }: UseDeleteCategory = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-categories']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Categoria removida com sucesso!',
      });
    },
  });
}

export { deleteCategory, useDeleteCategory };

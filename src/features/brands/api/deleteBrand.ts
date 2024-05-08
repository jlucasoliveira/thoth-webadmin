import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

async function deleteBrand(id: string) {
  return axios.delete(`/brands/${id}`);
}

type UseDeleteBrand = {
  config?: MutationConfig<typeof deleteBrand>;
};

function useDeleteBrand({ config }: UseDeleteBrand = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (id) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-brands']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Marca removida com sucesso!',
      });
    },
  });
}

export { deleteBrand, useDeleteBrand };

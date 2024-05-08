import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

async function deleteGender(id: string) {
  return axios.delete(`/genders/${id}`);
}

type UseDeleteGender = {
  config?: MutationConfig<typeof deleteGender>;
};

function useDeleteGender({ config }: UseDeleteGender = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (id) => deleteGender(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-genders']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Gênero removido com sucesso!',
      });
    },
  });
}

export { deleteGender, useDeleteGender };

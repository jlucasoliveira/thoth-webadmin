import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';

async function deleteExpense(id: number) {
  return axios.delete(`/expenses/${id}`);
}

type UseDeleteExpense = {
  config?: MutationConfig<typeof deleteExpense>;
};

function useDeleteExpense({ config }: UseDeleteExpense = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (id) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-expenses']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Despesa removida com sucesso!',
      });
    },
  });
}

export { deleteExpense, useDeleteExpense };

import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { ExpenseModel } from '../types';
import { Payload } from './createExpense';

type PartialUpdate = {
  id: number;
  payload: Partial<Payload>;
};

function expensePartialUpdate(params: PartialUpdate) {
  return axios.patch<ExpenseModel>(`/expenses/${params.id}`, params.payload);
}

type UseExpensePartialUpdate = {
  config?: MutationConfig<typeof expensePartialUpdate>;
};

function useExpensePartialUpdate({ config }: UseExpensePartialUpdate = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (params) => expensePartialUpdate(params),
    mutationKey: ['expense-partial-update'],
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-expenses']);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Despesa atualizada',
      });
      navigate(-1);
    },
  });
}

export { expensePartialUpdate, useExpensePartialUpdate };

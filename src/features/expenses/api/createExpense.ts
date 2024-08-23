import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { BaseEntity } from '@/types/common';
import { ExpenseModel } from '../types';

export type Payload = Omit<ExpenseModel, keyof BaseEntity | 'brand' | 'bankAccount'>;

async function createExpense(payload: Payload) {
  const { data } = await axios.post<ExpenseModel>(`/expenses`, payload);
  return data;
}

type UseCreateExpense = {
  config?: MutationConfig<typeof createExpense>;
};

function useCreateExpense({ config }: UseCreateExpense = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-expense'],
    mutationFn: (payload) => createExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-expenses']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Despesa criada.',
      });
      navigate(-1);
    },
  });
}

export { createExpense, useCreateExpense };

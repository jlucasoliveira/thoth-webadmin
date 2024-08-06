import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '@/lib/axios';
import { BaseEntityInt } from '@/types/common';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { BankAccountModel } from '../types';

export type Payload = Omit<BankAccountModel, keyof BaseEntityInt | 'owner' | 'payments'>;

async function createAccount(payload: Payload) {
  return axios.post<BankAccountModel>(`/bank-accounts`, payload);
}

type UseCreateAccount = {
  config?: MutationConfig<typeof createAccount>;
};

function useCreateAccount({ config }: UseCreateAccount = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-account'],
    mutationFn: (payload) => createAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-accounts']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Conta bancária criada.',
      });
      navigate(-1);
    },
  });
}

export { createAccount, useCreateAccount };

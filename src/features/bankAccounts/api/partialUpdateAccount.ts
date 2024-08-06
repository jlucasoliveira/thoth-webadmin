import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { Payload } from './createAccount';
import { BankAccountModel } from '../types';

type PartialUpdate = {
  id: number;
  payload: Partial<Payload>;
};

function accountPartialUpdate(params: PartialUpdate) {
  return axios.patch<BankAccountModel>(`/bank-accounts/${params.id}`, params.payload);
}

type UseAccountPartialUpdate = {
  config?: MutationConfig<typeof accountPartialUpdate>;
  forAttribute?: boolean;
};

function useAccountPartialUpdate({ config, forAttribute }: UseAccountPartialUpdate = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (params) => accountPartialUpdate(params),
    mutationKey: ['account-partial-update'],
    onSuccess: () => {
      if (forAttribute) queryClient.refetchQueries(['fetch-accounts']);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Conta bancária atualizada',
      });
    },
  });
}

export { accountPartialUpdate, useAccountPartialUpdate };

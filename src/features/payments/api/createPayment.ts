import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { PaymentModel } from '../types';

export type Payload = {
  orderId?: string;
  value: number;
  clientId: string;
  accountId: number;
};

async function createPayment(payload: Payload) {
  const { data } = await axios.post<PaymentModel>(`/payments`, payload);
  return data;
}

type UseCreatePayment = {
  config?: MutationConfig<typeof createPayment>;
};

function useCreatePayment({ config }: UseCreatePayment = {}) {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-payment'],
    mutationFn: (payload) => createPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-payments']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Pagamento criado',
      });
    },
  });
}

export { createPayment, useCreatePayment };

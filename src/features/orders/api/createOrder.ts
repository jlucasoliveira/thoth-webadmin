import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { BaseEntity } from '@/types/common';
import { OrderModel } from '../types';

export type PayloadItem = {
  variationId: string;
  quantity: number;
};

export type Payload = Omit<
  OrderModel,
  keyof BaseEntity | 'client' | 'seller' | 'payments' | 'items' | 'clientId'
> & {
  clientId?: string;
  items: PayloadItem[];
  retainedStock?: boolean;
};

async function createOrder(payload: Payload) {
  const { data } = await axios.post<OrderModel>(`/orders`, payload);
  return data;
}

type UseCreateOrder = {
  config?: MutationConfig<typeof createOrder>;
};

function useCreateOrder({ config }: UseCreateOrder = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ['create-order'],
    mutationFn: (payload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['fetch-orders']);
      addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Compra criada.',
      });
      navigate(-1);
    },
  });
}

export { createOrder, useCreateOrder };

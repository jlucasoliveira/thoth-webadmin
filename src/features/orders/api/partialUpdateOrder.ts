import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';
import { useNotificationStore } from '@/stores/notifications';
import { Payload } from './createOrder';
import { OrderRoutes } from '../routes/constants';
import { OrderModel } from '../types';

type PartialUpdate = {
  id: string;
  payload: Partial<Payload>;
};

function orderPartialUpdate(params: PartialUpdate) {
  return axios.patch<OrderModel>(`/orders/${params.id}`, params.payload);
}

type UseOrderPartialUpdate = {
  config?: MutationConfig<typeof orderPartialUpdate>;
  forAttribute?: boolean;
};

function useOrderPartialUpdate({ config, forAttribute }: UseOrderPartialUpdate = {}) {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (params) => orderPartialUpdate(params),
    mutationKey: ['order-partial-update'],
    onSuccess: () => {
      if (forAttribute) queryClient.refetchQueries(['fetch-orders']);
      else navigate(OrderRoutes.List);
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Compra atualizada',
      });
    },
  });
}

export { orderPartialUpdate, useOrderPartialUpdate };

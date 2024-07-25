import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { OrderModel } from '../types';
import { Pagination } from '@/types/pagination';

async function getOrder(id: string, params?: Pick<Pagination<OrderModel>, 'include'>) {
  const { data } = await axios.get<OrderModel>(`/orders/${id}`, { params });
  return data;
}

type QueryFnType = typeof getOrder;

type UseGetOrder = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
  params?: Pick<Pagination<OrderModel>, 'include'>;
};

function useGetOrder({ config, id, params }: UseGetOrder) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-order', id, params],
    queryFn: () => getOrder(id!, params),
    enabled: id !== undefined,
  });
}

export { getOrder, useGetOrder };

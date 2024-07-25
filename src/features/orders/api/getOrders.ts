import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { OrderModel } from '../types';

async function getOrders(params: Pagination<OrderModel>) {
  const { data } = await axios.get<Paginate<OrderModel>>(`/orders`, { params });
  return data;
}

type QueryFcType = typeof getOrders;

type UseOrders = {
  config?: QueryConfig<QueryFcType>;
  params: Pagination<OrderModel>;
};

function useOrders({ config, params }: UseOrders) {
  return useQuery<ExtractFnReturnType<QueryFcType>>({
    ...config,
    queryKey: ['fetch-orders', params],
    queryFn: () => getOrders(params),
  });
}

export { getOrders, useOrders };

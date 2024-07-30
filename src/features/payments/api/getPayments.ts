import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { PaymentModel } from '../types';

async function getPayments(params: Pagination<PaymentModel>) {
  const { data } = await axios.get<Paginate<PaymentModel>>(`/payments`, { params });
  return data;
}

type QueryFcType = typeof getPayments;

type UsePayments = {
  config?: QueryConfig<QueryFcType>;
  params: Pagination<PaymentModel>;
};

function usePayments({ config, params }: UsePayments) {
  return useQuery<ExtractFnReturnType<QueryFcType>>({
    ...config,
    queryKey: ['fetch-payments', params],
    queryFn: () => getPayments(params),
  });
}

export { getPayments, usePayments };

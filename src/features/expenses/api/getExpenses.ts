import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { ExpenseModel } from '../types';

async function getExpenses(params: Pagination<ExpenseModel>) {
  const { data } = await axios.get<Paginate<ExpenseModel>>(`/expenses`, { params });
  return data;
}

type QueryFcType = typeof getExpenses;

type UseExpenses = {
  config?: QueryConfig<QueryFcType>;
  params: Pagination<ExpenseModel>;
};

function useExpenses({ config, params }: UseExpenses) {
  return useQuery<ExtractFnReturnType<QueryFcType>>({
    ...config,
    queryKey: ['fetch-expenses', params],
    queryFn: () => getExpenses(params),
  });
}

export { getExpenses, useExpenses };

import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { ExpenseModel } from '../types';

async function getExpense(id: number) {
  const { data } = await axios.get<ExpenseModel>(`/expenses/${id}`);
  return data;
}

type QueryFnType = typeof getExpense;

type UseGetExpense = {
  config?: QueryConfig<QueryFnType>;
  id?: number;
};

function useGetExpense({ config, id }: UseGetExpense) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-expense', id],
    queryFn: () => getExpense(id!),
    enabled: id !== undefined,
  });
}

export { getExpense, useGetExpense };

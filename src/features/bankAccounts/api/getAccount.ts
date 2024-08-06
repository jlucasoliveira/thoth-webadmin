import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { useQuery } from '@tanstack/react-query';
import { BankAccountModel } from '../types';

async function getAccount(id: number) {
  const { data } = await axios.get<BankAccountModel>(`/bank-accounts/${id}`);
  return data;
}

type QueryFnType = typeof getAccount;

type UseGetAccount = {
  config?: QueryConfig<QueryFnType>;
  id?: number;
};

function useGetAccount({ config, id }: UseGetAccount) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-account', id],
    queryFn: () => getAccount(id!),
    enabled: !!id,
  });
}

export { getAccount, useGetAccount };

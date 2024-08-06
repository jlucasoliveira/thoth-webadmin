import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { BankAccountModel } from '../types';

async function getAccounts(
  params: Pagination<BankAccountModel>
): Promise<Paginate<BankAccountModel>> {
  const { data } = await axios.get(`/bank-accounts`, { params });
  return data;
}

type QueryFnType = typeof getAccounts;

type UseAccountsOptions = {
  config?: QueryConfig<QueryFnType>;
  params: Pagination<BankAccountModel>;
};

function useBankAccounts({ config, params }: UseAccountsOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-accounts', params],
    queryFn: () => getAccounts(params),
  });
}

export { getAccounts, useBankAccounts };

import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { ClientModel } from '../types';

async function getClients(params: Pagination<ClientModel>) {
  const { data } = await axios.get<Paginate<ClientModel>>(`/clients`, { params });
  return data;
}

type QueryFcType = typeof getClients;

type UseClients = {
  config?: QueryConfig<QueryFcType>;
  params: Pagination<ClientModel>;
};

function useClients({ config, params }: UseClients) {
  return useQuery<ExtractFnReturnType<QueryFcType>>({
    ...config,
    queryKey: ['fetch-clients', params],
    queryFn: () => getClients(params),
  });
}

export { getClients, useClients };

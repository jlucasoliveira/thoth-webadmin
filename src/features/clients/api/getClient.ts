import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { ClientModel } from '../types';

async function getClient(id: string) {
  const { data } = await axios.get<ClientModel>(`/clients/${id}`);
  return data;
}

type QueryFnType = typeof getClient;

type UseGetClient = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
};

function useGetClient({ config, id }: UseGetClient) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-client', id],
    queryFn: () => getClient(id!),
    enabled: id !== undefined,
  });
}

export { getClient, useGetClient };

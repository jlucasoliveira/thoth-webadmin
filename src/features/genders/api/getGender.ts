import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { useQuery } from '@tanstack/react-query';
import { GenderModel } from '../types';

async function getGender(id: string) {
  const { data } = await axios.get<GenderModel>(`/genders/${id}`);
  return data;
}

type QueryFnType = typeof getGender;

type UseGetGender = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
};

function useGetGender({ config, id }: UseGetGender) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-gender', id],
    queryFn: () => getGender(id!),
    enabled: !!id,
  });
}

export { getGender, useGetGender };

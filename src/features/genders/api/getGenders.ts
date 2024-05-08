import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { GenderModel } from '../types';

async function getGenders(params: Pagination<GenderModel>): Promise<Paginate<GenderModel>> {
  const { data } = await axios.get(`/genders`, { params });
  return data;
}

type QueryFnType = typeof getGenders;

type UseGendersOptions = {
  config?: QueryConfig<QueryFnType>;
  params: Pagination<GenderModel>;
};

function useGenders({ config, params }: UseGendersOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-genders', params],
    queryFn: () => getGenders(params),
  });
}

export { getGenders, useGenders };

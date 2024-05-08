import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { useQuery } from '@tanstack/react-query';
import { BrandModel } from '../types';

async function getBrand(id: string) {
  const { data } = await axios.get<BrandModel>(`/brands/${id}`);
  return data;
}

type QueryFnType = typeof getBrand;

type UseGetBrand = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
};

function useGetBrand({ config, id }: UseGetBrand) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-brand', id],
    queryFn: () => getBrand(id!),
    enabled: !!id,
  });
}

export { getBrand, useGetBrand };

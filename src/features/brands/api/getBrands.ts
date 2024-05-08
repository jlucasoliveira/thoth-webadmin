import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { BrandModel } from '../types';

async function getBrands(params: Pagination<BrandModel>): Promise<Paginate<BrandModel>> {
  const { data } = await axios.get(`/brands`, { params });
  return data;
}

type QueryFnType = typeof getBrands;

type UseBrandsOptions = {
  config?: QueryConfig<QueryFnType>;
  params: Pagination<BrandModel>;
};

function useBrands({ config, params }: UseBrandsOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-brands', params],
    queryFn: () => getBrands(params),
  });
}

export { getBrands, useBrands };

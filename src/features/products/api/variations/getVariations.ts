import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { ProductVariationModel } from '@/features/products/types';
import { Paginate, Pagination } from '@/types/pagination';

async function getVariations(params: Pagination<ProductVariationModel>) {
  const { data } = await axios.get<Paginate<ProductVariationModel>>(`/variations`, { params });
  return data;
}

type QueryFcType = typeof getVariations;

type UseVariations = {
  config?: QueryConfig<QueryFcType>;
  params: Pagination<ProductVariationModel>;
};

function useVariations({ config, params }: UseVariations) {
  return useQuery<ExtractFnReturnType<QueryFcType>>({
    ...config,
    queryKey: ['fetch-variations', params],
    queryFn: () => getVariations(params),
  });
}

export { getVariations, useVariations };

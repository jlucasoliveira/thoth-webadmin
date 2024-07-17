import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Pagination } from '@/types/pagination';
import { ProductVariationModel } from '../../types';

async function getProductVariation(
  id: string,
  params?: Pick<Pagination<ProductVariationModel>, 'include'>
) {
  const { data } = await axios.get<ProductVariationModel>(`/variations/${id}`, { params });
  return data;
}

type QueryFnType = typeof getProductVariation;

type UseGetProductVariation = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
  params?: Pick<Pagination<ProductVariationModel>, 'include'>;
};

function useGetProductVariation({ config, id, params }: UseGetProductVariation) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-variation', id, params],
    queryFn: () => getProductVariation(id!, params),
    enabled: !!id,
  });
}

export { getProductVariation, useGetProductVariation };

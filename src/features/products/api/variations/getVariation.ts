import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { ProductVariationModel } from '../../types';

async function getProductVariation(id: string) {
  const { data } = await axios.get<ProductVariationModel>(`/variations/${id}`);
  return data;
}

type QueryFnType = typeof getProductVariation;

type UseGetProductVariation = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
};

function useGetProductVariation({ config, id }: UseGetProductVariation) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-variation', id],
    queryFn: () => getProductVariation(id!),
    enabled: !!id,
  });
}

export { getProductVariation, useGetProductVariation };

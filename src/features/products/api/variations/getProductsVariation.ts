import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { ProductVariationModel } from '../../types';

async function getProductVariation(productId: string, params: Pagination<ProductVariationModel>) {
  const { data } = await axios.get<Paginate<ProductVariationModel>>(
    `/products/${productId}/variations`,
    { params }
  );
  return data;
}

type QueryFcType = typeof getProductVariation;

type UseProductVariations = {
  config?: QueryConfig<QueryFcType>;
  params: Pagination<ProductVariationModel>;
  productId?: string;
};

function useProductVariations({ config, params, productId }: UseProductVariations) {
  return useQuery<ExtractFnReturnType<QueryFcType>>({
    ...config,
    queryKey: ['fetch-variations', productId, params],
    queryFn: () => getProductVariation(productId!, params),
    enabled: !!productId,
  });
}

export { getProductVariation, useProductVariations };

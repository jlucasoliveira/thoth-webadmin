import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { StockModel } from '../types';

async function getStock(variationId: string) {
  const { data } = await axios.get<StockModel>(`/variations/${variationId}/stock`);
  return data;
}

type QueryFnType = typeof getStock;

type UseGetStock = {
  config?: QueryConfig<QueryFnType>;
  variationId?: string;
};

function useGetStock({ config, variationId }: UseGetStock) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-stock', variationId],
    queryFn: () => getStock(variationId!),
    enabled: !!variationId,
  });
}

export { getStock, useGetStock };

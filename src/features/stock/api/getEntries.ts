import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { StockEntryModel } from '../types';

type Params = {
  variationId: string;
  stockId: string;
  params: Pagination<StockEntryModel>;
};

async function getStockEntries(config: Params) {
  const { params, variationId, stockId } = config;
  const { data } = await axios.get<Paginate<StockEntryModel>>(
    `/variations/${variationId}/stock/${stockId}/entries`,
    { params }
  );
  return data;
}

type QueryFcType = typeof getStockEntries;

type UseStockEntries = {
  config?: QueryConfig<QueryFcType>;
  params: Params;
};

function useStockEntries({ config, params }: UseStockEntries) {
  return useQuery<ExtractFnReturnType<QueryFcType>>({
    ...config,
    queryKey: ['fetch-entries', params],
    queryFn: () => getStockEntries(params),
    enabled: !!params.variationId && !!params.stockId,
  });
}

export { getStockEntries, useStockEntries };

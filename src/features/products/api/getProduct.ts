import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { ProductModel } from '../types';

async function getProduct(id: number) {
  const { data } = await axios.get<ProductModel>(`/products/${id}`);
  return data;
}

type QueryFnType = typeof getProduct;

type UseGetProduct = {
  config?: QueryConfig<QueryFnType>;
  id?: number;
};

function useGetProduct({ config, id }: UseGetProduct) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-product', id],
    queryFn: () => getProduct(id!),
    enabled: id !== undefined,
  });
}

export { getProduct, useGetProduct };

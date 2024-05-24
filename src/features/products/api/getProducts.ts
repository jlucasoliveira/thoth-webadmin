import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { ProductModel } from '../types';

async function getProducts(params: Pagination<ProductModel>) {
  const { data } = await axios.get<Paginate<ProductModel>>(`/products`, { params });
  return data;
}

type QueryFcType = typeof getProducts;

type UseProducts = {
  config?: QueryConfig<QueryFcType>;
  params: Pagination<ProductModel>;
};

function useProducts({ config, params }: UseProducts) {
  return useQuery<ExtractFnReturnType<QueryFcType>>({
    ...config,
    queryKey: ['fetch-products', params],
    queryFn: () => getProducts(params),
  });
}

export { getProducts, useProducts };

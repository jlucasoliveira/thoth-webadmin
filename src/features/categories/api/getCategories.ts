import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';
import { CategoryModel } from '../types';

async function getCategories(params: Pagination<CategoryModel>): Promise<Paginate<CategoryModel>> {
  const { data } = await axios.get(`/categories`, { params });
  return data;
}

type QueryFnType = typeof getCategories;

type UseCategoriesOptions = {
  config?: QueryConfig<QueryFnType>;
  params: Pagination<CategoryModel>;
};

function useCategories({ config, params }: UseCategoriesOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-categories', params],
    queryFn: () => getCategories(params),
  });
}

export { getCategories, useCategories };

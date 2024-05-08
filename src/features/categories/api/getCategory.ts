import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { useQuery } from '@tanstack/react-query';
import { CategoryModel } from '../types';

async function getCategory(id: string) {
  const { data } = await axios.get<CategoryModel>(`/categories/${id}`);
  return data;
}

type QueryFnType = typeof getCategory;

type UseGetCategory = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
};

function useGetCategory({ config, id }: UseGetCategory) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-category', id],
    queryFn: () => getCategory(id!),
    enabled: !!id,
  });
}

export { getCategory, useGetCategory };

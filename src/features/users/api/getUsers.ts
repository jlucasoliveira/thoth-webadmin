import { useQuery } from '@tanstack/react-query';
import { UserModel } from '@/features/auth/types';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { Paginate, Pagination } from '@/types/pagination';

async function getUsers(params: Pagination<UserModel>): Promise<Paginate<UserModel>> {
  const { data } = await axios.get('/users', { params });
  return data;
}

type QueryFnType = typeof getUsers;

type UseUsersOptions = {
  config?: QueryConfig<QueryFnType>;
  params: Pagination<UserModel>;
};

function useUsers({ config, params }: UseUsersOptions) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-users', params],
    queryFn: () => getUsers(params),
  });
}

export { getUsers, useUsers };

import { UserModel } from '@/features/auth/types';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { useQuery } from '@tanstack/react-query';

async function getUser(id: string) {
  const { data } = await axios.get<UserModel>(`/users/${id}`);
  return data;
}

type QueryFnType = typeof getUser;

type UseGetUser = {
  config?: QueryConfig<QueryFnType>;
  id?: string;
};

function useGetUser({ config = {}, id }: UseGetUser) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['fetch-user', id],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => getUser(id!),
    enabled: !!id,
  });
}

export { getUser, useGetUser };

import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { UserModel } from '../types/user';

async function getUser() {
  return axios.get<UserModel>('/auth/me');
}

type QueryFnType = typeof getUser;

type UseProfileConfig = {
  config?: QueryConfig<QueryFnType>;
};

function useProfile({ config }: UseProfileConfig) {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['get-profile'],
    queryFn: getUser,
  });
}

export { getUser, useProfile };

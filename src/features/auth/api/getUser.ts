import { axios } from '@/lib/axios';
import { UserModel } from '../types/user';
import { useQuery } from '@tanstack/react-query';

async function getUser() {
  return axios.get<UserModel>('/auth/me');
}

function useProfile() {
  return useQuery({
    queryKey: ['get-profile'],
    queryFn: getUser,
    enabled: false,
  });
}

export { getUser, useProfile };

import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '@/components/Elements';
import { getUser } from '@/features/auth/api/getUser';
import { useUserStore } from '@/stores/user';
import { storage } from '@/utils/storage';

function AuthProvider({ children }: PropsWithChildren<object>) {
  const navigate = useNavigate();
  const {
    token,
    setUpUserData,
    removeToken,
    removeUserData,
  } = useUserStore();

  const { data, isError, status, refetch } = useQuery({
    queryKey: ['get-profile'],
    queryFn: getUser,
    enabled: false,
  });

  useEffect(() => {
    if (data?.data) setUpUserData(data.data);
  }, [data, setUpUserData]);

  useEffect(() => {
    if (isError) storage.clearToken();
  }, [isError]);

  useEffect(() => {
    const storageToken = storage.getToken();
    console.log({ storageToken })
    if (storageToken === null) {
      removeToken();
      removeUserData();
      navigate('/', { replace: true });
    }
    if (token) refetch({ cancelRefetch: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (status === 'success') {
    return children;
  }

  return <Loading />;
}

export { AuthProvider };

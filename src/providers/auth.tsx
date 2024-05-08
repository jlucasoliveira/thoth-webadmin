import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@/components/Elements';
import { useProfile } from '@/features/auth/api/getUser';
import { useUserStore } from '@/stores/user';
import { storage } from '@/utils/storage';

function AuthProvider({ children }: PropsWithChildren<object>) {
  const navigate = useNavigate();
  const { data, isError, status, refetch } = useProfile();
  const { token, setUpUserData, removeToken, removeUserData } = useUserStore();

  useEffect(() => {
    if (data?.data) setUpUserData(data.data);
  }, [data, setUpUserData]);

  useEffect(() => {
    if (isError) storage.clearToken();
  }, [isError]);

  useEffect(() => {
    const storageToken = storage.getToken();
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

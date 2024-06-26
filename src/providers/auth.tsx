/* eslint-disable react-hooks/exhaustive-deps */
import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@/components/Elements';
import { useProfile } from '@/features/auth/api/getUser';
import { useUserStore } from '@/stores/user';
import { storage } from '@/utils/storage';

function AuthProvider({ children }: PropsWithChildren<object>) {
  const navigate = useNavigate();
  const { token, setToken, setIsLoggedIn, setUpUserData, removeToken, removeUserData } =
    useUserStore();
  const { data, status } = useProfile({
    config: {
      enabled: token !== undefined,
      retry: false,
    },
  });

  useEffect(() => {
    const storageToken = storage.getToken();
    if (storageToken === null) {
      removeToken();
      removeUserData();
      navigate('/', { replace: true });
    } else {
      setToken(storageToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (status === 'success' && data !== undefined) {
      setUpUserData(data.data);
      setIsLoggedIn(true);
    }
  }, [status, data]);

  if (status === 'success') {
    return children;
  }

  return <Loading />;
}

export { AuthProvider };

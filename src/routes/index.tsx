import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { storage } from '@/utils/storage';
import { useUserStore } from '@/stores/user';
import { publicRoutes } from './public';
import { privateRoutes } from './private';

function AppRoutes() {
  const element = useRoutes([...publicRoutes, ...privateRoutes]);
  const { setToken, setIsLoggedIn } = useUserStore();

  useEffect(() => {
    const storageToken = storage.getToken();
    if (storageToken) {
      setToken(storageToken);
      setIsLoggedIn(true);
    }
  }, [setToken, setIsLoggedIn]);

  return <>{element}</>;
}

export { AppRoutes };

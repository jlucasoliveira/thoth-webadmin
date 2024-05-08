import { useMemo } from 'react';
import { Navigate, useLocation, NavigateProps } from 'react-router-dom';
import { AuthRoutes } from '@/features/auth/routes/constants';
import { useUserStore } from '@/stores/user';

function EntryRoute() {
  const location = useLocation();
  const { isLoggedIn } = useUserStore();

  const nextRoute = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    const nextPage = queryParams.get('next');
    return isLoggedIn ? nextPage ?? '/products' : AuthRoutes.Login;
  }, [isLoggedIn, location.search]);

  const navigationProps: NavigateProps = useMemo(
    () => ({
      replace: true,
      to: nextRoute,
      state: { location },
    }),
    [location, nextRoute]
  );

  return <Navigate {...navigationProps} />;
}

export { EntryRoute };

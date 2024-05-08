import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/stores/user';

type Props = {
  element: ReactNode;
  nextPage?: string;
};

function Authenticated({ element, nextPage = '/users' }: Props) {
  const location = useLocation();
  const { isLoggedIn, user } = useUserStore();

  if (!user.id) return null;

  if (!isLoggedIn) {
    return <Navigate replace to={`/?next=${location.pathname}`} state={{ location }} />;
  }

  if (isLoggedIn) {
    return element;
  }

  return <Navigate replace to={nextPage} state={{ location }} />;
}

export { Authenticated };

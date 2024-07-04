import { Authenticated } from '@/components/Routers';
import { Route, Routes } from 'react-router-dom';
import { UserManage } from './UserManage';
import { UserRoutes as UserRoutesEnum } from './constants';
import { Users } from './Users';

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Authenticated element={<Users />} />} />
      <Route path="manage/:id?" element={<Authenticated element={<UserManage />} />} />
    </Routes>
  );
}

export { UserRoutes, UserRoutesEnum };

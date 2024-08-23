import { Route, Routes } from 'react-router-dom';
import { Authenticated } from '@/components/Routers';
import { ExpenseRoutes as ExpenseRoutesEnum } from './constants';
import { ExpenseManage } from './ExpenseManage';
import { Expenses } from './Expenses';

function ExpenseRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Authenticated element={<Expenses />} />} />
      <Route path="/manage/:id?" element={<Authenticated element={<ExpenseManage />} />} />
    </Routes>
  );
}

export { ExpenseRoutes, ExpenseRoutesEnum };

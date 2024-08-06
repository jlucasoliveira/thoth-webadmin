import { Route, Routes } from 'react-router-dom';
import { Authenticated } from '@/components/Routers';
import { BankAccounts } from './BankAccounts';
import { AccountManage } from './BankAccountsManage';
import { BankAccountsRoutes as BankAccountsRoutesEnum } from './constants';

function BankAccountsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Authenticated element={<BankAccounts />} />} />
      <Route path="manage/:id?" element={<Authenticated element={<AccountManage />} />} />
    </Routes>
  );
}

export { BankAccountsRoutes, BankAccountsRoutesEnum };

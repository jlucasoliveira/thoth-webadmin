import { BankAccountsList } from '../components/BankAccountsList';
import { ListWrapper } from '@/components/Layout';
import { BankAccountsRoutes } from './constants';

function BankAccounts() {
  return (
    <ListWrapper
      List={BankAccountsList}
      title="Contas bancárias"
      registrationRoute={BankAccountsRoutes.Registration}
    />
  );
}

export { BankAccounts };

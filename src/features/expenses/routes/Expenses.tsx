import { ListWrapper } from '@/components/Layout';
import { ExpenseRoutes } from './constants';
import { ExpenseList } from '../components/ExpenseList';

export function Expenses() {
  return (
    <ListWrapper
      title="Despesas"
      registrationRoute={ExpenseRoutes.Registration}
      List={ExpenseList}
    />
  );
}

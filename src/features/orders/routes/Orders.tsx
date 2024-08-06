import { ListWrapper } from '@/components/Layout';
import { OrderList } from '../components/OrderList';
import { OrderRoutes } from './constants';

function Orders() {
  return (
    <ListWrapper
      title="Vendas"
      searchField="client.name"
      registrationRoute={OrderRoutes.Registration}
      List={OrderList}
    />
  );
}

export { Orders };

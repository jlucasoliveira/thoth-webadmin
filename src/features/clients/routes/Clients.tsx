import { ListWrapper } from '@/components/Layout';
import { ClientList } from '../components/ClientList';
import { ClientRoutes } from './constants';

function Clients() {
  return (
    <ListWrapper
      title="Clientes"
      searchField="name"
      registrationRoute={ClientRoutes.Registration}
      List={ClientList}
    />
  );
}

export { Clients };

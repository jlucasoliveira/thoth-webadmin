import { UsersList } from '../components/UsersList';
import { ListWrapper } from '@/components/Layout';
import { UserRoutesEnum } from '..';

function Users() {
  return (
    <ListWrapper
      List={UsersList}
      title="Usuários"
      addButtonText="Novo usuário"
      registrationRoute={UserRoutesEnum.Registration}
    />
  );
}

export { Users };

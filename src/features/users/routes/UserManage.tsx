import { useNavigate, useParams } from 'react-router-dom';
import { useFilters } from '@/hooks/useFilters';
import { Params } from '@/types/props';
import { extractChangedValues } from '@/utils/helpers';
import { CreateUserForm, FormType } from '../components/UserManageForm';
import { Payload, useCreateUser } from '../api/createUser';
import { useUserPartialUpdate } from '../api/userPartialUpdate';
import { useGetUser } from '../api/getUser';
import { UserRoutes } from './constants';

function UserManage() {
  const { id } = useParams<Params>();
  const { isEdit } = useFilters();
  const navigate = useNavigate();
  const currentUser = useGetUser({ id });
  const creation = useCreateUser();
  const edit = useUserPartialUpdate();

  function parseFormToPayload(data: FormType): Payload {
    return {
      username: data.username!,
      isAdmin: false,
      name: data.name,
      password: data.password as unknown as string,
    };
  }

  async function onSubmit(data: FormType) {
    const payload = parseFormToPayload(data);
    if (id) {
      const changedFields = extractChangedValues(currentUser.data!, payload);
      await edit.mutateAsync({ id, payload: changedFields });
    } else await creation.mutateAsync(payload);
    navigate(UserRoutes.Users, { replace: true });
  }

  return (
    <CreateUserForm
      id={id}
      isEdit={isEdit}
      onSubmit={onSubmit}
      loading={creation.isLoading || edit.isLoading}
      fetchingLoading={currentUser.isFetching && currentUser.isLoading}
      data={currentUser.data}
    />
  );
}

export { UserManage };

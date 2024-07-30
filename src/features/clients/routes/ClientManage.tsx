import { useParams } from 'react-router-dom';
import { Params } from '@/types/props';
import { useFilters } from '@/hooks/useFilters';
import { extractChangedValues } from '@/utils/helpers';
import { FormType } from '../components/validation';
import { ClientManageForm } from '../components/ClientManageForm';
import { useClientPartialUpdate } from '../api/partialUpdateClient';
import { useCreateClient } from '../api/createClient';
import { useGetClient } from '../api/getClient';
import { parseFormTypeToPayload } from '../utils/parser';

function ClientManage() {
  const { id } = useParams<Params>();
  const { isEdit } = useFilters();
  const currentClient = useGetClient({ id });
  const creation = useCreateClient();
  const edit = useClientPartialUpdate();

  async function onSubmit(data: FormType) {
    const payload = parseFormTypeToPayload(data);
    if (id) {
      const changedFields = extractChangedValues(currentClient.data!, payload);
      await edit.mutateAsync({ id, payload: changedFields });
    } else {
      await creation.mutateAsync(payload);
    }
  }

  return (
    <ClientManageForm
      id={id}
      isEdit={isEdit}
      onSubmit={onSubmit}
      loading={creation.isLoading || edit.isLoading}
      data={currentClient.data}
      fetchingLoading={currentClient.isFetching && currentClient.isLoading}
    />
  );
}

export { ClientManage };

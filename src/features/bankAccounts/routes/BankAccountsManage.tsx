import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Params } from '@/types/props';
import { useFilters } from '@/hooks/useFilters';
import { extractChangedValues } from '@/utils/helpers';
import { FormType, BankAccountManageForm } from '../components/BankAccountManageForm';
import { Payload, useCreateAccount } from '../api/createAccount';
import { useAccountPartialUpdate } from '../api/partialUpdateAccount';
import { useGetAccount } from '../api/getAccount';
import { BankAccountsRoutes } from './constants';

function AccountManage() {
  const { id } = useParams<Params>();
  const { isEdit } = useFilters();
  const navigate = useNavigate();
  const supplier = useGetAccount({ id: id ? Number(id) : undefined });
  const creation = useCreateAccount();
  const update = useAccountPartialUpdate();

  function parseFormTypeToPayload(data: FormType): Payload {
    return {
      name: data.name,
      accountNumber: data.accountNumber,
      agency: data.agency,
      ownerId: data.owner?.id,
    };
  }

  async function onSubmit(data: FormType) {
    const payload = parseFormTypeToPayload(data);

    if (id) {
      const changedFields = extractChangedValues(supplier.data!, payload);
      await update.mutateAsync({ id: Number(id), payload: changedFields });
    } else {
      await creation.mutateAsync(payload);
    }
    navigate(generatePath(BankAccountsRoutes.List));
  }

  return (
    <BankAccountManageForm
      id={id}
      isEdit={isEdit}
      loading={creation.isLoading || update.isLoading}
      onSubmit={onSubmit}
      data={supplier.data}
      fetchingLoading={supplier.isFetching && supplier.isLoading}
    />
  );
}

export { AccountManage };

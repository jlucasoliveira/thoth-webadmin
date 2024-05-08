import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Params } from '@/types/props';
import { useFilters } from '@/hooks/useFilters';
import { extractChangedValues } from '@/utils/helpers';
import { FormType, GenderManageForm } from '../components/GenderManageForm';
import { Payload, useCreateGender } from '../api/createGender';
import { useGenderPartialUpdate } from '../api/partialUpdateGender';
import { useGetGender } from '../api/getGender';
import { GendersRoutes } from './constants';

function GenderManage() {
  const { id } = useParams<Params>();
  const { isEdit } = useFilters();
  const navigate = useNavigate();
  const supplier = useGetGender({ id });
  const creation = useCreateGender();
  const update = useGenderPartialUpdate();

  function parseFormTypeToPayload(data: FormType): Payload {
    return { name: data.name };
  }

  async function onSubmit(data: FormType) {
    const payload = parseFormTypeToPayload(data);

    if (id) {
      const changedFields = extractChangedValues(supplier.data!, payload);
      await update.mutateAsync({ id, payload: changedFields });
    } else {
      await creation.mutateAsync(payload);
    }
    navigate(generatePath(GendersRoutes.List));
  }

  return (
    <GenderManageForm
      id={id}
      isEdit={isEdit}
      loading={creation.isLoading || update.isLoading}
      onSubmit={onSubmit}
      data={supplier.data}
      fetchingLoading={supplier.isFetching && supplier.isLoading}
    />
  );
}

export { GenderManage };

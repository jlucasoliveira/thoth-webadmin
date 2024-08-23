import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Params } from '@/types/props';
import { useFilters } from '@/hooks/useFilters';
import { extractChangedValues } from '@/utils/helpers';
import { FormType, CategoryManageForm } from '../components/CategoryManageForm';
import { Payload, useCreateCategory } from '../api/createCategory';
import { useCategoryPartialUpdate } from '../api/partialUpdateCategory';
import { useGetCategory } from '../api/getCategory';
import { CategoriesRoutes } from './constants';

function CategoryManage() {
  const { id } = useParams<Params>();
  const { isEdit } = useFilters();
  const navigate = useNavigate();
  const supplier = useGetCategory({ id });
  const creation = useCreateCategory();
  const update = useCategoryPartialUpdate();

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
    navigate(generatePath(CategoriesRoutes.List));
  }

  return (
    <CategoryManageForm
      id={id}
      isEdit={isEdit}
      loading={creation.isLoading || update.isLoading}
      onSubmit={onSubmit}
      data={supplier.data}
      fetchingLoading={supplier.isFetching && supplier.isLoading}
    />
  );
}

export { CategoryManage };

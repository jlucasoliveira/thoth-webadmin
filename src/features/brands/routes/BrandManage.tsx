import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Params } from '@/types/props';
import { useFilters } from '@/hooks/useFilters';
import { extractChangedValues } from '@/utils/helpers';
import { FormType, BrandManageForm } from '../components/BrandManageForm';
import { Payload, useCreateBrand } from '../api/createBrand';
import { useBrandPartialUpdate } from '../api/partialUpdateBrand';
import { useGetBrand } from '../api/getBrand';
import { BrandsRoutes } from './constants';

function BrandManage() {
  const { id } = useParams<Params>();
  const { isEdit } = useFilters();
  const navigate = useNavigate();
  const supplier = useGetBrand({ id: id ? Number(id) : undefined });
  const creation = useCreateBrand();
  const update = useBrandPartialUpdate();

  function parseFormTypeToPayload(data: FormType): Payload {
    return {
      name: data.name,
      profitRate: data.profitRate,
    };
  }

  async function onSubmit(data: FormType) {
    const payload = parseFormTypeToPayload(data);

    if (id) {
      const changedFields = extractChangedValues(supplier.data!, payload);
      await update.mutateAsync({ id, payload: changedFields });
    } else {
      await creation.mutateAsync(payload);
    }
    navigate(generatePath(BrandsRoutes.List));
  }

  return (
    <BrandManageForm
      id={id}
      isEdit={isEdit}
      loading={creation.isLoading || update.isLoading}
      onSubmit={onSubmit}
      data={supplier.data}
      fetchingLoading={supplier.isFetching && supplier.isLoading}
    />
  );
}

export { BrandManage };

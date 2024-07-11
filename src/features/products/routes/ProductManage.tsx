import { useParams } from 'react-router-dom';
import { Params } from '@/types/props';
import { useFilters } from '@/hooks/useFilters';
import { extractChangedValues } from '@/utils/helpers';
import { useSendFileToBucket } from '@/features/attachments/api/sendFileToBucket';
import { useDeleteAttachment } from '@/features/attachments/api/deleteAttachment';
import { FormType } from '../components/Forms/validation';
import { ProductManageForm } from '../components/ProductManageForm';
import { useProductPartialUpdate } from '../api/partialUpdateProduct';
import { useCreateProduct } from '../api/createProduct';
import { parseFormTypeToPayload } from '../utils/parser';
import { useGetProduct } from '../api/getProduct';
import { useCreateVariation } from '../api/variations/createVariation';
import { useVariationPartialUpdate } from '../api/variations/partialUpdateVariation';
import { performCreation } from '../components/Variations/utils';

function ProductManage() {
  const { id } = useParams<Params>();
  const { isEdit } = useFilters();
  const currentProduct = useGetProduct({ id: id ? Number(id) : undefined });
  const creation = useCreateProduct();
  const edit = useProductPartialUpdate();
  const sendToBucket = useSendFileToBucket();
  const deleteAttachment = useDeleteAttachment();
  const createVariation = useCreateVariation();
  const updateVariation = useVariationPartialUpdate();

  async function onSubmit(data: FormType) {
    const payload = parseFormTypeToPayload(data);
    if (id) {
      const changedFields = extractChangedValues(currentProduct.data!, payload);
      await edit.mutateAsync({ id, payload: changedFields });
    } else {
      const product = await creation.mutateAsync(payload);
      await Promise.all(
        (data.variations ?? []).map(async (form) =>
          performCreation(
            createVariation.mutateAsync,
            updateVariation.mutateAsync,
            sendToBucket.mutateAsync,
            deleteAttachment.mutateAsync,
            product.id,
            { form }
          )
        )
      );
    }
  }

  return (
    <ProductManageForm
      id={id}
      isEdit={isEdit}
      onSubmit={onSubmit}
      loading={
        creation.isLoading || edit.isLoading || sendToBucket.isLoading || deleteAttachment.isLoading
      }
      data={currentProduct.data}
      fetchingLoading={currentProduct.isFetching && currentProduct.isLoading}
    />
  );
}

export { ProductManage };

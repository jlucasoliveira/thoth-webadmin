import { AxiosError, AxiosResponse } from 'axios';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { BaseEntity } from '@/types/common';
import { extractChangedValues } from '@/utils/helpers';
import { Payload as UploadPayload } from '@/features/attachments/api/sendFileToBucket';
import { Payload } from '../../api/variations/createVariation';
import { PartialUpdate } from '../../api/variations/partialUpdateVariation';
import { parseFormTypeToVariationPayload } from '../../utils/parser';
import { ProductVariationModel } from '../../types';
import { FormPayload } from './VariationModal';
import { ImageFormType } from '../Forms/validation';

type Response = Omit<Payload, 'categories'> & BaseEntity;
type Mutation<T, R = BaseEntity> = UseMutateAsyncFunction<R, AxiosError<unknown, any>, T>;

export async function performVariationMutation(
  [create, update]: [Mutation<Payload, Response[]>, Mutation<PartialUpdate>],
  { categories, ...payload }: Payload,
  variation?: ProductVariationModel
): Promise<string> {
  if (variation?.id) {
    await update({
      id: variation.id,
      productId: variation.productId,
      payload: {
        ...extractChangedValues(variation, payload),
        categories,
      },
    });
    return variation.id;
  } else {
    const data = await create({ ...payload, categories });
    return data[0].id;
  }
}

export async function performImageUpload(
  mutate: Mutation<UploadPayload>,
  variationId: string,
  images: ImageFormType[]
) {
  await Promise.all(
    (images ?? []).map(({ image, _id }) => {
      if (!_id)
        return mutate({
          file: image,
          resource: 'products.images',
          variationId: variationId,
        });
    })
  );
}

export async function performCreation(
  createVariation: Mutation<Payload, Response[]>,
  updateVariation: Mutation<PartialUpdate>,
  createAttachment: Mutation<UploadPayload>,
  deleteAttachment: Mutation<string, AxiosResponse>,
  productId: number,
  { form, variation }: FormPayload
) {
  const payload = parseFormTypeToVariationPayload(form, productId);

  if (form.icon) {
    if (payload.iconId) await deleteAttachment(payload.iconId);

    const attachment = await createAttachment({
      file: form.icon,
      resource: 'products',
    });
    payload.iconId = attachment.id;
  }

  const variationId = await performVariationMutation(
    [createVariation, updateVariation],
    payload,
    variation
  );

  await performImageUpload(createAttachment, variationId, form.images ?? []);
}

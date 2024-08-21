import { InferType, array, mixed, object } from 'yup';
import { batchSchema } from '@/features/products/components/Forms/validation';
import { ProductVariationModel } from '@/features/products/types';
import { Payload } from '../../api/batchInventoryEntry';
import { StockKind } from '../../types';

const variation = object().shape({
  variation: mixed<ProductVariationModel>().required(),
});

export const schema = batchSchema.concat(variation);

export type FormBatchType = InferType<typeof schema>;

export const defaultValues: FormBatchType = {
  amount: 1,
  costPrice: 0,
  kind: StockKind.Entry,
  entryDate: new Date(),
  expirationDate: new Date(),
  variation: { variation: '', product: { name: '' } } as ProductVariationModel,
};

export const batchItemsSchema = object().shape({
  items: array(schema),
});

export type ItemsSchema = InferType<typeof batchItemsSchema>;

export function parseItemSchemaIntoPayload(data: Array<FormBatchType>): Payload {
  const entries: Payload['entries'] = data.map((item) => ({
    ...item,
    entryDate: (item.entryDate ?? new Date()).toJSON(),
    expirationDate: item.expirationDate.toJSON(),
    variationId: item.variation.id,
  }));

  return { entries };
}

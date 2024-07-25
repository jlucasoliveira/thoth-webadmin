import { UserModel } from '@/features/auth/types';
import { ClientModel } from '@/features/clients/types';
import { ProductVariationModel } from '@/features/products/types';
import { BaseEntity } from '@/types/common';
import { array, boolean, InferType, mixed, number, object, string } from 'yup';

type Variation = Omit<ProductVariationModel, keyof BaseEntity | 'categories'> &
  Pick<BaseEntity, 'id'>;

const itemSchema = object().shape({
  _id: number(),
  total: number(),
  price: number(),
  quantity: number()
    .typeError('Informe um número válido')
    .positive('Informe um número posito')
    .default(1),
  variation: mixed<Omit<Variation, 'product' | 'stock'>>().required(
    'Insira uma variação corretamente'
  ),
});

export const schema = object().shape({
  id: string().optional(),
  paid: boolean().default(false),
  persistStock: boolean().default(true),
  client: mixed<ClientModel>().optional(),
  seller: mixed<UserModel>().optional(),
  total: string(),
  totalPaid: number()
    .default(0)
    .typeError('Infome um valor válido')
    .min(0, 'Informe um número positivo'),
  items: array(itemSchema),
});

export const tempVariationSchema = object().shape({
  variation: mixed<Variation>(),
  quantity: number()
    .typeError('Informe um número válido')
    .positive('Informe um número posito')
    .default(1),
});

export type FormType = InferType<typeof schema>;
export type FormItemType = InferType<typeof itemSchema>;
export type FormTempType = InferType<typeof tempVariationSchema>;

export const defaultValues: FormType = {
  paid: false,
  persistStock: true,
  totalPaid: 0,
};

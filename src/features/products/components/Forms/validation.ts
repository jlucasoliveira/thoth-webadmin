import { AttachmentEntity } from '@/features/attachments/types';
import { StockKind } from '@/features/stock/types';
import { InferType, array, date, mixed, number, object, string } from 'yup';
import { Gender, ProductVariationModel } from '../../types';

export const batchSchema = object().shape({
  entryDate: date().typeError('Informe uma data válida'),
  expirationDate: date().typeError('Informe uma data válida').required('Campo obrigatório'),
  kind: mixed<StockKind>().oneOf(Object.values(StockKind)).required('Campo obrigatório'),
  newPrice: number(),
  costPrice: number()
    .typeError('Informe um numeral')
    .min(0, 'Informe um valor maior ou igual a zero'),
  amount: number()
    .typeError('Informe um numeral')
    .required('Campo obrigatório')
    .min(0, 'Informe um valor maior ou igual a zero'),
});

export const imagesSchema = object({
  id: string().optional(),
  _id: string().optional(),
  image: mixed<File>().required(),
  imageObject: mixed<AttachmentEntity>().optional(),
});

export type ImageFormType = InferType<typeof imagesSchema>;

export const variationSchema = object().shape({
  _id: string().optional(),
  variation: string().optional(),
  externalCode: string().required('Campo obrigatório'),
  barcode: string().optional(),
  price: number()
    .required('Campo obrigatório')
    .typeError('Informe um valor válido')
    .positive('Informe um número positivo'),
  quantity: number().min(0, 'Informe um número válido').optional(),
  costPrice: number().min(0, 'Informe um número válido').optional(),
  icon: mixed<File>(),
  iconObject: mixed<AttachmentEntity>().optional().nullable(),
  images: array(imagesSchema),
  productId: number().optional(),
});

export type VariationForm = InferType<typeof variationSchema>;

export const optionValue = {
  label: string().required(),
  value: number().required(),
};

export const schema = object().shape({
  id: string().optional(),
  name: string().required('Campo obrigatório'),
  weight: number().min(0, 'Informe um valor válido').typeError('Informe um número').optional(),
  volume: number().min(0, 'Informe um valor válido').typeError('Informe um número').optional(),
  brand: object().shape(optionValue).required('Campo obrigatório'),
  category: object().shape(optionValue).required('Campo obrigatório'),
  gender: mixed<Gender>().oneOf(Object.values(Gender)),
  variations: array(variationSchema),
});

export type FormType = InferType<typeof schema>;

export function parseVariationToForm(variation: ProductVariationModel): VariationForm {
  return {
    _id: variation.id,
    externalCode: variation.externalCode,
    price: variation.price,
    variation: variation.variation,
    barcode: variation.barcode ?? undefined,
    productId: variation.productId,
  };
}

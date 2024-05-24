import { AttachmentEntity } from '@/features/attachments/types';
import { StockKind } from '@/features/stock/types';
import { InferType, array, date, mixed, number, object, string } from 'yup';

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
  variation: string().required('Campo obrigatório'),
  externalCode: string().required('Campo obrigatório'),
  barcode: string().optional(),
  price: number().required('Campo obrigatório'),
  icon: mixed<File>(),
  iconObject: mixed<AttachmentEntity>().optional().nullable(),
  images: array(imagesSchema),
  productId: string().optional(),
});

export type VariationForm = InferType<typeof variationSchema>;

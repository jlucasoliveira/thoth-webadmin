import { BaseEntity } from '@/types/common';
import { Gender } from './gender';
export * from './gender';

export type ProductVariationModel = BaseEntity & {
  variation: string;
  externalCode: string;
  barcode?: string | null;
  price: number;
  iconId?: string | null;
  productId: string;
  product: ProductModel;
};

export type ProductModel = BaseEntity & {
  name: string;
  weight: number;
  volume: number;
  brandId: string;
  categoryId: string;
  gender?: Gender;
};

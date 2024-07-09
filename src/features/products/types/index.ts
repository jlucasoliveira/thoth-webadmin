import { BaseEntity } from '@/types/common';
import { Gender } from './gender';
import { StockModel } from '@/features/stock/types';
export * from './gender';

export type ProductVariationModel = BaseEntity & {
  variation: string;
  externalCode: string;
  barcode?: string | null;
  price: number;
  iconId?: string | null;
  productId: string;
  readonly product: ProductModel;
  readonly stock: StockModel;
};

export type ProductModel = BaseEntity & {
  name: string;
  weight: number;
  volume: number;
  brandId: string;
  categoryId: string;
  gender?: Gender;
};

import { BaseEntity, BaseEntityInt } from '@/types/common';
import { Gender } from './gender';
import { StockModel } from '@/features/stock/types';
export * from './gender';

export type ProductVariationModel = BaseEntity & {
  variation?: string;
  externalCode: string;
  barcode?: string | null;
  price: number;
  iconId?: string | null;
  productId: number;
  readonly product: ProductModel;
  readonly stock: StockModel;
};

export type ProductModel = BaseEntityInt & {
  name: string;
  weight?: number;
  volume?: number;
  brandId: number;
  categoryId?: number;
  gender?: Gender;
};

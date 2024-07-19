import { BaseEntity, BaseEntityInt } from '@/types/common';
import { Gender } from './gender';
import { StockModel } from '@/features/stock/types';
import { CategoryModel } from '@/features/categories/types';
export * from './gender';

export type ProductVariationModel = BaseEntity & {
  variation?: string;
  externalCode: string;
  barcode?: string | null;
  price: number;
  iconId?: string | null;
  productId: number;
  weight?: number;
  volume?: number;
  gender?: Gender;
  readonly categories: CategoryModel[];
  readonly product: ProductModel;
  readonly stock: StockModel;
};

export type ProductModel = BaseEntityInt & {
  name: string;
  brandId: number;
};

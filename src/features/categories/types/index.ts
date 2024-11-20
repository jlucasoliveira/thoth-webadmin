import { BrandModel } from '@/features/brands/types';
import { BaseEntityInt as BaseEntity } from '@/types/common';

export type CategoryModel = BaseEntity & {
  name: string;
  brandId?: number;
  readonly brand: BrandModel;
};

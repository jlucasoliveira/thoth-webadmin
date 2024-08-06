import { BaseEntityInt as BaseEntity } from '@/types/common';

export type BrandModel = BaseEntity & {
  name: string;
  profitRate: number;
  isPublic?: boolean;
};

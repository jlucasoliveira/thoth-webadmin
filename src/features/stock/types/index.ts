import { BaseEntity } from '@/types/common';
import { UserModel } from '@/features/auth/types';

export enum StockKind {
  Entry = 'ENTRY',
  Removal = 'REMOVAL',
  Lose = 'LOSE',
}

export type StockEntryModel = BaseEntity & {
  entryDate: string;
  costPrice?: number;
  expirationDate: string;
  amount: number;
  kind: StockKind;
  userId?: string;
  readonly user: UserModel;
};

export type StockModel = BaseEntity & {
  quantity: number;
  productId: string;
  minQuantity: number;
};

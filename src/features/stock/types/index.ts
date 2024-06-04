import { BaseEntity } from '@/types/common';

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
};

export type StockModel = BaseEntity & {
  quantity: number;
  productId: string;
};

import { Control } from 'react-hook-form';
import { Pagination } from './pagination';

export type InternalControl<T> = Control<T, any>;

export type ClientParams<T> = {
  clientId: string;
  params: Pagination<T>;
};

export type Address = {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  state: string;
  city: string;
  reference?: string;
};

export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type BaseEntityInt = Omit<BaseEntity, 'id'> & {
  id: number;
};

export const baseEntityColumns: Array<keyof BaseEntity> = [
  'createdAt',
  'deletedAt',
  'id',
  'updatedAt',
] as const;

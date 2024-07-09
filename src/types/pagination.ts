import { BaseEntity } from './common';

type DescOrder<T = object> = {
  [key in keyof T as `-${key & string}`]: T[key];
};

export type Operator = 'eq' | 'ne' | 'ilike' | 'date';

export type Sort<T> = keyof T | keyof DescOrder<T>;

export type Filter<T> = {
  [key in keyof T]?: {
    [operator in Operator]?: string | number | string[];
  } & {
    or?: Array<string> | Array<number>;
    in?: string[];
    between?: [startValue: string, endValue: string];
  };
};

type Flatten<T> = T extends any[] ? T[number] : T;

type Include<T> = {
  [key in keyof T]?: Flatten<T[key]> extends BaseEntity ? boolean | Include<T[key]> : undefined;
};

export type Pagination<T = object> = {
  pageSize?: number;
  pageNumber: number;
  filter?: Filter<T>;
  sort?: Sort<T>;
  include?: Include<T>;
};

type Meta = {
  totalPages: number;
  totalCount: number;
};

export type Paginate<T = any> = {
  data: T[];
  meta: Meta;
};

export const defaultPaginate: Paginate<any> = {
  data: [],
  meta: {
    totalCount: 0,
    totalPages: 1,
  },
};

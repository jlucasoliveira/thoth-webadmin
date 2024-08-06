import { BaseEntity, BaseEntityInt } from './common';

type DescOrder<T = object> = {
  [key in keyof T as `-${key & string}`]: T[key];
};

export type Sort<T> = keyof T | keyof DescOrder<T>;

export type Operator = 'eq' | 'ne' | 'like' | 'ilike' | 'date' | 'gt' | 'gte' | 'lt' | 'lte';

export type Query<T> = Partial<Record<Operator, T>> & {
  or?: Array<FilterOperator<T>>;
  in?: string[] | number[];
  between?: [startValue: string, endValue: string] | [startValue: number, endValue: number];
};

export type FilterOperator<T> = {
  [key in keyof T]?: Flatten<T[key]> extends Record<string, any>
    ? FilterOperator<Flatten<T[key]>>
    : Query<Flatten<T[key]>>;
};

export type Filter<T> = FilterOperator<T> | Array<FilterOperator<T>>;

export type Flatten<T> = T extends any[] ? T[number] : T;

type Include<T> = {
  [key in keyof T]?: Flatten<T[key]> extends BaseEntity | BaseEntityInt
    ? boolean | Include<Flatten<T[key]>>
    : undefined;
};

export type Pagination<T = object> = {
  limit?: number;
  skip: number;
  pageNumber: number;
  filter?: Filter<T>;
  sort?: Sort<T>;
  include?: Include<T>;
};

type Meta = {
  page: number;
  limit: number;
  itens: number;
  total: number;
  pages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type Paginate<T = any> = {
  data: T[];
  meta: Meta;
};

export const defaultPaginate: Paginate<any> = {
  data: [],
  meta: {
    page: 1,
    limit: 10,
    itens: 0,
    total: 0,
    pages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  },
};

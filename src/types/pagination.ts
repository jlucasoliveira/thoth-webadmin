type DescOrder<T = object> = {
  [key in keyof T as `-${key & string}`]: T[key];
};

export type Operator = 'eq' | 'ne' | 'ilike' | 'date';

export type Sort<T> = keyof T | keyof DescOrder<T>;

export type Filter<T> = {
  [key in keyof T]?: {
    [operator in Operator]?: string | number | string[];
  } & {
    // or?: Array<string | number>;
    in?: string[];
    between?: [startValue: string, endValue: string];
  };
};

export type Pagination<T = object> = {
  pageSize?: number;
  pageNumber: number;
  filter?: Filter<T>;
  sort?: Sort<T>;
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

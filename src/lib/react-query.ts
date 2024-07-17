import { AxiosError } from 'axios';
import {
  QueryClient,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  DefaultOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PromiseValue } from 'type-fest';
import { Paginate, Pagination } from '@/types/pagination';

const queryConfig: DefaultOptions = {
  queries: {
    useErrorBoundary: false,
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type ExtractFnReturnType<FnType extends (...args: any) => any> = PromiseValue<
  ReturnType<FnType>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type InfinityQueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseInfiniteQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  AxiosError,
  Parameters<MutationFnType>[0]
>;

type ExtraArgs<T> = {
  args?: T;
};

type UseFetchQueryFn<T, Args> = (
  params: Pagination<T> & ExtraArgs<Args>,
  ...args: any
) => Promise<Paginate<T>>;

type UseFetchOptions<T, Args = any> = {
  config?: QueryConfig<UseFetchQueryFn<T, Args>>;
  params: Pagination<T> & ExtraArgs<Args>;
};

export type UseFetch<T = object, Args = any> = (
  options: UseFetchOptions<T, Args> | any
) => UseQueryResult<Paginate<T>, unknown>;

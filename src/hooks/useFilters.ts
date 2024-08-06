import qs from 'qs';
import { useCallback, useMemo } from 'react';
import { SortingState, Updater } from '@tanstack/react-table';
import { SetURLSearchParams, useSearchParams } from 'react-router-dom';
import { Filter, Operator, Pagination, Sort } from '@/types/pagination';

const PAGE_SIZE = 10;
export enum SearchParamsKeys {
  PAGE = 'page',
  ORDER = 'order',
  FILTER = 'filter',
  EDIT = 'edit',
  TAB = 'tab',
}

type Props = {
  pageSize?: number;
  context?: string;
};

type Filters<T> = {
  params: URLSearchParams;
  query: Pagination<T>;
  sorting: SortingState;
  isEdit: boolean;
  currentTab: number;
  setParams: SetURLSearchParams;
  addFilter: (key: keyof T, op: Operator, value: string | number) => void;
  removeFilter: (key: keyof T) => void;
  replaceFilter: (filters: Filter<T>, keep?: boolean) => void;
  addOrder: (sort: Sort<T>) => void;
  removeOrder: (sort: Sort<T>) => void;
  handleOrder: (updater: Updater<SortingState>) => void;
  clearFilters: () => void;
  clear: () => void;
  changePage: (page: number) => void;
  previousPage: () => number;
  nextPage: (maxPage: number) => number;
  changeTab: (tabIndex: number, keep?: boolean) => void;
  addParam: (param: string, value: string) => void;
  removeParam: (param: string) => void;
  getParam: (param: string) => string | null;
  hasFilters: () => boolean;
};

function useFilters<T>(
  { pageSize = PAGE_SIZE, context = '' }: Props = { pageSize: PAGE_SIZE, context: '' }
): Filters<T> {
  const [params, setParams] = useSearchParams();

  const buildKeyName = useCallback(
    (param: string) => `${context}${context ? '|' : ''}${param}`,
    [context]
  );

  const buildKey = useCallback((key: SearchParamsKeys) => buildKeyName(key), [buildKeyName]);

  const createFilterKeyValue = useCallback((initial = '', ...props: string[]) => {
    const keys = props.map((key) => `[${key}]`);
    return initial.concat(...keys);
  }, []);

  const createFilterKey = useCallback(
    (key?: keyof T, op?: Operator, idx?: number): string => {
      const defaultParams = idx !== undefined ? [idx.toString()] : [];
      const param: string = createFilterKeyValue(
        buildKey(SearchParamsKeys.FILTER),
        ...defaultParams
      );
      if (key && op) return createFilterKeyValue(param, key as string, op as string);
      if (key) return createFilterKeyValue(param, key as string);
      return param;
    },
    [buildKey, createFilterKeyValue]
  );

  const query = useMemo(() => {
    const parsed = qs.parse(params.toString());
    const page = parsed[buildKey(SearchParamsKeys.PAGE)];
    const orders = parsed[buildKey(SearchParamsKeys.ORDER)];
    const filter = parsed[buildKey(SearchParamsKeys.FILTER)] as Filter<T>;
    const pageNumber = Number(page) || 1;

    const pagination: Pagination<T> = {
      pageNumber,
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      sort: orders as Sort<T>,
      filter,
    };
    return pagination;
  }, [params, buildKey, pageSize]);

  const sorting: SortingState = useMemo(() => {
    const order = params.getAll(buildKey(SearchParamsKeys.ORDER));
    return order.map((attr) => ({ id: attr.replace('-', ''), desc: attr.startsWith('-') }));
  }, [buildKey, params]);

  const isEdit = useMemo(() => params.has(buildKey(SearchParamsKeys.EDIT)), [buildKey, params]);

  const clearFilters = useCallback(() => {
    setParams((params) => {
      params.forEach((_, key) => {
        if (key.startsWith(createFilterKey())) params.delete(key);
      });
      params.set(buildKey(SearchParamsKeys.PAGE), '1');
      return params;
    });
  }, [setParams, buildKey, createFilterKey]);

  const clearOrder = useCallback(() => {
    setParams((params) => {
      params.delete(buildKey(SearchParamsKeys.ORDER));
      return params;
    });
  }, [buildKey, setParams]);

  const clear = useCallback(() => {
    setParams((params) => {
      params.forEach((_, key) => params.delete(key));
      return params;
    });
  }, [setParams]);

  const hasFilters = useCallback(() => {
    for (const key of params.keys()) {
      if (key.startsWith(buildKey(SearchParamsKeys.FILTER))) return true;
    }
    return false;
  }, [buildKey, params]);

  const addFilter = useCallback(
    (key: keyof T, op: Operator, value: string | number) => {
      setParams((params) => {
        params.append(createFilterKey(key, op), value.toString());
        params.set(buildKey(SearchParamsKeys.PAGE), '1');
        return params;
      });
    },
    [setParams, createFilterKey, buildKey]
  );

  const removeFilter = useCallback(
    (filterKey: keyof T) => {
      setParams((params) => {
        params.forEach((_, key) => {
          if (key.startsWith(createFilterKey(filterKey))) params.delete(key);
        });
        params.set(buildKey(SearchParamsKeys.PAGE), '1');
        return params;
      });
    },
    [setParams, buildKey, createFilterKey]
  );

  const replaceFilter = useCallback(
    (filters: Filter<T>, keep = false) => {
      setParams((oldParams) => {
        const parsed = qs.stringify({ [buildKey(SearchParamsKeys.FILTER)]: filters });
        const params = new URLSearchParams(parsed);
        params.set(buildKey(SearchParamsKeys.PAGE), '1');
        return keep ? Object.fromEntries([...oldParams.entries(), ...params.entries()]) : params;
      });
    },
    [setParams, buildKey]
  );

  const addParam = useCallback(
    (param: string, value: string) => {
      setParams((params) => {
        params.set(buildKeyName(param), value);
        return params;
      });
    },
    [buildKeyName, setParams]
  );

  const removeParam = useCallback(
    (param: string) => {
      setParams((params) => {
        params.delete(buildKeyName(param));
        return params;
      });
    },
    [buildKeyName, setParams]
  );

  const getParam = useCallback(
    (param: string) => params.get(buildKeyName(param)),
    [buildKeyName, params]
  );

  const addOrder = useCallback(
    (sort: Sort<T>) => {
      setParams((params) => {
        params.set(buildKey(SearchParamsKeys.ORDER), sort.toString());
        params.set(buildKey(SearchParamsKeys.PAGE), '1');
        return params;
      });
    },
    [buildKey, setParams]
  );

  const removeOrder = useCallback(
    (sort: Sort<T>) => {
      setParams((params) => {
        params.forEach((value, key) => {
          if (key === buildKey(SearchParamsKeys.ORDER) && value === sort) {
            params.delete(key, value);
          }
        });
        return params;
      });
    },
    [buildKey, setParams]
  );

  const handleOrder = useCallback(
    (updater: Updater<SortingState>) => {
      const manualSorting: SortingState = [];
      if (typeof updater === 'function') {
        manualSorting.push(...updater(sorting));
      } else {
        manualSorting.push(...updater);
      }
      if (manualSorting.length > 0) {
        const field = manualSorting[0];
        addOrder(`${field.desc ? '-' : ''}${field.id}` as Sort<T>);
      } else {
        clearOrder();
      }
    },
    [addOrder, clearOrder, sorting]
  );

  const changePage = useCallback(
    (page: number) => {
      setParams((params) => {
        params.set(buildKey(SearchParamsKeys.PAGE), page.toString());
        return params;
      });
    },
    [buildKey, setParams]
  );

  const previousPage = useCallback(() => {
    let page = 1;
    setParams((params) => {
      const key = buildKey(SearchParamsKeys.PAGE);
      const currentPage = Number(params.get(key) || '1');
      page = currentPage - 1;
      if (currentPage > 1) params.set(key, page.toString());
      return params;
    });
    return page;
  }, [buildKey, setParams]);

  const nextPage = useCallback(
    (maxPage: number) => {
      let page = 1;
      setParams((params) => {
        const key = buildKey(SearchParamsKeys.PAGE);
        const currentPage = Number(params.get(key) || '1');
        page = currentPage + 1;
        if (currentPage < maxPage) params.set(key, page.toString());
        return params;
      });
      return page;
    },
    [buildKey, setParams]
  );

  const currentTab = useMemo(() => {
    const tab = Number(params.get(buildKey(SearchParamsKeys.TAB)));
    return isNaN(tab) ? 0 : tab;
  }, [buildKey, params]);

  const changeTab = useCallback(
    (tabIndex: number, keep?: boolean) => {
      if (keep) {
        setParams((params) => {
          params.set(SearchParamsKeys.TAB, tabIndex.toString());
          return params;
        });
      } else {
        setParams(new URLSearchParams([[buildKey(SearchParamsKeys.TAB), tabIndex.toString()]]));
      }
    },
    [buildKey, setParams]
  );

  return {
    params,
    isEdit,
    query,
    sorting,
    currentTab,
    setParams,
    clearFilters,
    clear,
    addFilter,
    addOrder,
    removeOrder,
    handleOrder,
    removeFilter,
    replaceFilter,
    changePage,
    nextPage,
    previousPage,
    changeTab,
    getParam,
    addParam,
    removeParam,
    hasFilters,
  };
}

export { useFilters };

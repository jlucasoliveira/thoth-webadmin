import { Filter, Operator, Pagination, Sort } from '@/types/pagination';
import { SortingState, Updater } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import { SetURLSearchParams, useSearchParams } from 'react-router-dom';

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
  replaceFilter: (filters: Filter<T>) => void;
  addOrder: (sort: Sort<T>) => void;
  removeOrder: (sort: Sort<T>) => void;
  handleOrder: (updater: Updater<SortingState>) => void;
  clearFilters: () => void;
  clear: () => void;
  changePage: (page: number) => void;
  previousPage: () => number;
  nextPage: (maxPage: number) => number;
  changeTab: (tabIndex: number, keep?: boolean) => void;
};

function useFilters<T>(
  { pageSize, context }: Props = { pageSize: PAGE_SIZE, context: '' }
): Filters<T> {
  const [params, setParams] = useSearchParams();

  const buildKey = useCallback(
    (key: SearchParamsKeys) => `${context}${context ? '_' : ''}${key}`,
    [context]
  );

  const createFilterKeyValue = useCallback((initial = '', ...props: string[]) => {
    const keys = props.map((key) => `[${key}]`);
    return initial.concat(...keys);
  }, []);

  const createFilterKey = useCallback(
    (key?: keyof T, op?: Operator): string => {
      const param: string = buildKey(SearchParamsKeys.FILTER);
      if (key && op) return createFilterKeyValue(param, key as string, op as string);
      if (key) return createFilterKeyValue(param, key as string);
      return param;
    },
    [buildKey, createFilterKeyValue]
  );

  const parseFilters = useCallback((filters: [string, string][]): Filter<T> => {
    const regex = /\[[0-9a-zA-Z]+]/g;
    return filters.reduce((acc = {}, [key, value]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [attr, op, idx] = Array.from(key.match(regex) || []).map((matched) =>
        matched.replaceAll(/\[|]/g, '')
      );
      if (op === 'in' && idx) {
        acc[attr as keyof T] = {
          ...(acc[attr as keyof T] || {}),
          in: [...(acc[attr as keyof T]?.in || []), value],
        };
      } else if (op === 'between' && idx) {
        const between = acc[attr as keyof T]?.between || Array(2);
        between.splice(Number(idx), 1, value);
        acc[attr as keyof T] = {
          ...acc[attr as keyof T],
          between,
        };
      } else acc[attr as keyof T] = { ...(acc[attr as keyof T] || {}), [op]: value };
      return acc;
    }, {} as Filter<T>);
  }, []);

  const query = useMemo(() => {
    const page = params.get(buildKey(SearchParamsKeys.PAGE));
    const orders = params.get(buildKey(SearchParamsKeys.ORDER));
    const filters = Array.from(params.entries()).filter(([key]) =>
      key.startsWith(createFilterKey())
    );

    const pagination: Pagination<T> = {
      pageSize,
      pageNumber: Number(page) || 1,
      sort: orders as Sort<T>,
      filter: parseFilters(filters),
    };
    return pagination;
  }, [params, buildKey, pageSize, parseFilters, createFilterKey]);

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
    (filters: Filter<T>) => {
      setParams((params) => {
        params.forEach((_, key) => {
          if (key.startsWith(createFilterKey())) params.delete(key);
        });
        Object.entries(filters).forEach(([key, operations]) => {
          Object.entries(operations as object).forEach(([op, value]) => {
            const newKey = createFilterKey(key as keyof T, op as Operator);
            if (Array.isArray(value)) {
              value.forEach((subValue, idx) => {
                Object.entries(subValue).forEach(([innerKey, innerOperation]) => {
                  Object.entries(innerOperation as object).forEach(([innerOp, innerValue]) => {
                    const subKey = createFilterKeyValue(
                      undefined,
                      `${idx}`,
                      innerKey,
                      innerOp as string
                    );
                    params.set(newKey.concat(subKey), innerValue);
                  });
                });
              });
            } else params.set(newKey, value.toString());
          });
        });
        params.set(buildKey(SearchParamsKeys.PAGE), '1');
        return params;
      });
    },
    [setParams, buildKey, createFilterKey, createFilterKeyValue]
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
  };
}

export { useFilters };

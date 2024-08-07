import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Select, { InputActionMeta, Props } from 'react-select';
import { ActionMeta, CSSObjectWithLabel, GroupBase } from 'react-select';
import {
  ControllerFieldState,
  FieldPathValue,
  FieldValues,
  Path,
  useController,
} from 'react-hook-form';
import { useTheme } from '@chakra-ui/react';
import { UseFetch } from '@/lib/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { BaseEntity } from '@/types/common';
import { Filter, Pagination } from '@/types/pagination';
import type { SearchBuilder } from '@/components/Layout/ListWrapper';
import { Loading } from '../Elements';
import { FieldWrapper, FieldWrapperProps } from '.';

type OnChange<T extends FieldValues> = (event: ChangeEvent | FieldPathValue<T, Path<T>>) => void;

export type SearchableSelectProps<
  F,
  T extends FieldValues = FieldValues,
  IsMulti extends boolean = false,
  P = any,
> = FieldWrapperProps<T> &
  Props<F, IsMulti, GroupBase<F>> & {
    useFetch: UseFetch<F, P>;
    defaultOptionValue?: IsMulti extends true ? Array<number> | Array<string> : number | string;
    defaultOption?: IsMulti extends true ? F[] : F;
    handleSetValue?: (data: IsMulti extends true ? F[] : F) => void;
    searchField?: keyof F;
    fetcherExtraParams?: Partial<Pagination<F>>;
    fetcherFilters?: Filter<F>;
    refetch?: boolean;
    forceFetch?: boolean;
    searchBuilder?: SearchBuilder<F>;
  };

function SearchableSelect<
  F,
  T extends FieldValues = FieldValues,
  IsMulti extends boolean = false,
  P = any,
>({
  control,
  label,
  name,
  required,
  isRequired,
  labelStyles,
  useFetch,
  defaultOptionValue,
  defaultOption,
  handleSetValue,
  fetcherExtraParams,
  searchField = 'name' as keyof F,
  childErrorAttrName,
  fetcherFilters,
  refetch,
  forceFetch = false,
  isMulti,
  searchBuilder,
  ...props
}: SearchableSelectProps<F, T, IsMulti, P>) {
  const isMounted = useRef<boolean>(false);
  const theme = useTheme();
  const {
    field: { value },
  } = useController({ control, name });
  const [search, setSearch] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 300);

  const filters = useMemo(() => {
    if (!debouncedSearch) return {} as Filter<F>;
    if (searchBuilder) return searchBuilder(debouncedSearch);
    return { [searchField]: { ilike: debouncedSearch } };
  }, [debouncedSearch, searchField, searchBuilder]);

  const fetched = useFetch({
    params: {
      filter: { ...filters, ...fetcherFilters, ...fetcherExtraParams?.filter } as Filter<F>,
      pageNumber: 1,
      skip: 0,
      ...fetcherExtraParams,
    },
    config: { enabled: forceFetch || refetch === undefined },
  });

  function getControlStyles(base: CSSObjectWithLabel, fieldState: ControllerFieldState) {
    return {
      ...base,
      borderColor: fieldState.invalid ? theme.colors.blue['300'] : base.borderColor,
      borderWidth: fieldState.invalid ? 2 : base.borderWidth,
    };
  }

  useEffect(() => {
    if (defaultOptionValue && handleSetValue && !value?.id && isMounted.current) {
      const selected = fetched.data?.data.find(
        (obj) => (obj as BaseEntity).id == defaultOptionValue
      );
      if (selected) handleSetValue(selected as IsMulti extends true ? F[] : F);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOptionValue, handleSetValue, value, isMounted.current]);

  useEffect(() => {
    if (defaultOption && handleSetValue) {
      handleSetValue(
        (isMulti && !Array.isArray(defaultOption) ? [defaultOption] : defaultOption) as any
      );
    }
  }, [defaultOption, handleSetValue, isMulti]);

  useEffect(() => {
    if (refetch) {
      fetched.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  useEffect(() => {
    if (!isMounted.current) isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = useCallback(
    (onChange: OnChange<T>, value: any, action: ActionMeta<F>) => {
      if (action.action === 'select-option') {
        onChange(value);
        if (search) setSearch(undefined);
      }
    },
    [search]
  );

  const onInputChange = useCallback((inputText: string, event: InputActionMeta) => {
    if (event.action !== 'input-blur' && event.action !== 'menu-close') {
      setSearch(inputText);
    }
  }, []);

  return (
    <FieldWrapper
      control={control}
      label={label}
      name={name}
      required={required}
      isRequired={isRequired}
      labelStyles={labelStyles}
      childErrorAttrName={childErrorAttrName}
    >
      {({ field, fieldState }) => (
        <Select
          styles={{
            control: (base) => getControlStyles(base, fieldState),
            menu: (base) => ({ ...base, zIndex: 3 }),
            ...props.styles,
          }}
          isSearchable
          {...props}
          {...field}
          isMulti={isMulti}
          loadingMessage={() => <Loading size="sm" />}
          noOptionsMessage={() => 'Nenhuma opção disponível'}
          getOptionValue={(option) => (option as BaseEntity).id?.toString()}
          placeholder={props.placeholder ? props.placeholder : 'Selecione'}
          options={fetched.data?.data ?? []}
          onChange={(...args) => handleChange(field.onChange, ...args)}
          required={required}
          isLoading={fetched.isFetching && fetched.isLoading}
          onInputChange={onInputChange}
        />
      )}
    </FieldWrapper>
  );
}

export { SearchableSelect };

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Select, { InputActionMeta, Props } from 'react-select';
import { ActionMeta, CSSObjectWithLabel, GroupBase } from 'react-select';
import {
  ControllerFieldState,
  FieldPathValue,
  FieldValues,
  Path,
  PathValue,
  useController,
} from 'react-hook-form';
import { useTheme } from '@chakra-ui/react';
import { UseFetch } from '@/lib/react-query';
import { Filter } from '@/types/pagination';
import { Loading } from '../Elements';
import { FieldWrapper, FieldWrapperProps } from '.';

type OnChange<T extends FieldValues> = (event: ChangeEvent | FieldPathValue<T, Path<T>>) => void;

export type Option<P = any, V = any> = {
  label: string;
  value: V;
  obj?: P;
};

export type SearchableSelectProps<
  F extends Record<string, any>,
  T extends FieldValues = FieldValues,
  IsMulti extends boolean = false,
  P = any,
> = FieldWrapperProps<T> &
  Props<Option<F>, IsMulti, GroupBase<Option>> & {
    parseOptions: (obj: F) => Option;
    useFetch: UseFetch<F, P>;
    defaultOptionValue?: any;
    defaultOption?: F;
    handleSetValue?: (data: Option<F>) => void;
    searchField?: keyof F;
    fetcherExtraParams?: P;
    fetcherFilters?: Filter<F>;
    refetch?: boolean;
    forceFetch?: boolean;
  };

function SearchableSelect<
  F extends Record<string, any>,
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
  parseOptions,
  useFetch,
  defaultOptionValue,
  defaultOption,
  handleSetValue,
  fetcherExtraParams,
  searchField = 'name', // TODO: Add search param filter
  childErrorAttrName,
  fetcherFilters,
  refetch,
  forceFetch = false,
  ...props
}: SearchableSelectProps<F, T, IsMulti, P>) {
  const isMounted = useRef<boolean>(false);
  const theme = useTheme();
  const {
    field: { value },
  } = useController({ control, name });
  const [search, setSearch] = useState<string | undefined>(undefined);
  const fetched = useFetch({
    params: {
      filter: {
        [searchField]: search ? { ilike: search } : undefined,
        ...fetcherFilters,
      } as Filter<F>,
      pageNumber: 1,
      args: fetcherExtraParams,
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

  const options = useMemo(() => {
    if (!fetched.data?.data) return [];
    return fetched.data.data.map((data) => parseOptions(data));
  }, [fetched.data, parseOptions]);

  useEffect(() => {
    if (defaultOptionValue && handleSetValue && !value?.value && isMounted.current) {
      const selected = options.find((option) => option.value === defaultOptionValue);
      if (selected) handleSetValue(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOptionValue, handleSetValue, options, value, isMounted.current]);

  useEffect(() => {
    if (defaultOption && handleSetValue) {
      handleSetValue(parseOptions(defaultOption));
    }
  }, [defaultOption, handleSetValue, parseOptions]);

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
    (onChange: OnChange<T>, value: any, action: ActionMeta<Option<F>>) => {
      // TODO: Handle other actions
      if (action.action === 'select-option') {
        onChange(value);
        if (search) setSearch(undefined);
      }
      if (action.action === 'clear') onChange({ value: '', label: '' } as PathValue<T, Path<T>>);
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
          isClearable
          {...props}
          {...field}
          loadingMessage={() => <Loading size="sm" />}
          noOptionsMessage={() => 'Nenhuma opção disponível'}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          placeholder={props.placeholder ? props.placeholder : 'Selecione'}
          options={options}
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

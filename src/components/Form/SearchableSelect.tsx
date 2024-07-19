import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
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
import { BaseEntity } from '@/types/common';
import { Filter } from '@/types/pagination';
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
    fetcherExtraParams?: P;
    fetcherFilters?: Filter<F>;
    refetch?: boolean;
    forceFetch?: boolean;
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
      skip: 0,
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

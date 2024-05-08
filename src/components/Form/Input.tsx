import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  InputGroup,
  InputRightElement,
  IconButton,
  InputLeftAddon,
  InputAddonProps,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import React, { ChangeEvent, useCallback } from 'react';
import { ControllerRenderProps, FieldPathValue, FieldValues, Path } from 'react-hook-form';
import { FieldWrapper, FieldWrapperProps } from './FieldWrapper';

export type InputProps<T extends FieldValues = FieldValues> = {
  placeholder?: string;
  rightElement?: React.ReactNode;
  leftAddon?: InputAddonProps['children'];
  cleaner?: (value: string) => string;
  formatter?: (value: string) => string;
} & ChakraInputProps &
  FieldWrapperProps<T> &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function Input<T extends FieldValues>({
  rightElement,
  leftAddon,
  cleaner,
  formatter,
  ...props
}: InputProps<T>) {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const getValue = useCallback(
    (field: ControllerRenderProps<T, Path<T>>) => {
      if (props.type === 'file') return undefined;
      if ((field.value as any) instanceof Date)
        return format(
          field.value,
          `yyyy-MM-dd${props.type === 'datetime-local' ? "'T'HH:mm" : ''}`
        );
      if (cleaner) return cleaner(field.value);
      return field.value;
    },
    [props, cleaner]
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target?.files?.[0]) {
        return event.target.files[0];
      }
      const value = event.target.value;
      return formatter ? formatter(value) : value;
    },
    [formatter]
  );

  return (
    <FieldWrapper {...props}>
      {({ field, fieldState }) => (
        <InputGroup>
          {leftAddon ? <InputLeftAddon>{leftAddon}</InputLeftAddon> : null}
          <ChakraInput
            autoComplete={props.type === 'password' ? 'new-password' : undefined}
            {...field}
            {...props}
            onChange={(e) => field.onChange(handleChange(e) as FieldPathValue<T, Path<T>>)}
            value={getValue(field)}
            isInvalid={fieldState.invalid}
            errorBorderColor="blue.300"
            type={props.type === 'password' ? (show ? 'text' : 'password') : props.type}
            _disabled={{ bgColor: 'gray.60' }}
          />
          {rightElement ? (
            <InputRightElement>{rightElement}</InputRightElement>
          ) : props.type === 'password' ? (
            <InputRightElement>
              <IconButton
                aria-label="Mostrar/Ocultar senha"
                onClick={handleClick}
                icon={show ? <ViewOffIcon /> : <ViewIcon />}
              />
            </InputRightElement>
          ) : null}
        </InputGroup>
      )}
    </FieldWrapper>
  );
}

export { Input };

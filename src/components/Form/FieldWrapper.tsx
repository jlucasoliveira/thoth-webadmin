import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import React from 'react';
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';

type ControllerProps<T extends FieldValues, N extends Path<T>> = {
  field: ControllerRenderProps<T, N>;
  fieldState: ControllerFieldState;
};

type _FieldWrapperProps<T extends FieldValues = FieldValues> = {
  children: (props: ControllerProps<T, Path<T>>) => React.ReactNode;
  label: string;
  placeholder?: string;
  name: Path<T>;
  control: Control<T, any>;
  required?: boolean;
  isRequired?: boolean;
  labelStyles?: React.CSSProperties;
  childErrorAttrName?: string;
};

export type FieldWrapperProps<T extends FieldValues> = Omit<_FieldWrapperProps<T>, 'children'>;

function FieldWrapper<T extends FieldValues = FieldValues>(props: _FieldWrapperProps<T>) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={(fieldProps) => (
        <FormControl
          isInvalid={fieldProps.fieldState.invalid}
          isRequired={props.required || props.isRequired}
        >
          <FormLabel fontSize={13} whiteSpace="nowrap" style={props.labelStyles}>
            {props.label}
          </FormLabel>
          {props.children(fieldProps)}
          {!fieldProps.fieldState.invalid ? (
            <div style={{ minHeight: 'calc(17px + 0.5rem)' }} />
          ) : null}
          <FormErrorMessage fontSize={13}>
            {props.childErrorAttrName
              ? (fieldProps.fieldState.error as Record<string, any>)?.[props.childErrorAttrName]
                  ?.message
              : fieldProps.fieldState.error?.message}
          </FormErrorMessage>
        </FormControl>
      )}
    />
  );
}

export { FieldWrapper };

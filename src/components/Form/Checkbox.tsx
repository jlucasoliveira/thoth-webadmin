import { FieldValues, Path, PathValue } from 'react-hook-form';
import { Checkbox as ChakraCheckbox, CheckboxProps as ChakraCheckboxProps } from '@chakra-ui/react';
import { FieldWrapper, FieldWrapperProps } from './FieldWrapper';

export type CheckboxProps<T extends FieldValues = FieldValues> = ChakraCheckboxProps &
  FieldWrapperProps<T> &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    rightElement?: React.ReactNode;
  };

function Checkbox<T extends FieldValues>({ label, rightElement, ...props }: CheckboxProps<T>) {
  return (
    <FieldWrapper label="" {...props}>
      {({ field, fieldState }) => (
        <>
          <div style={{ minHeight: 'calc(21px + 0.5rem)' }} />
          <ChakraCheckbox
            {...field}
            {...props}
            isInvalid={fieldState.invalid}
            errorBorderColor="blue.300"
            isChecked={field.value}
            onChange={(e) => field.onChange(e.target.checked as PathValue<T, Path<T>>)}
          >
            {label}
          </ChakraCheckbox>
          {rightElement}
        </>
      )}
    </FieldWrapper>
  );
}

export { Checkbox };

import { FieldValues } from 'react-hook-form';
import { Textarea as ChakraTextarea, TextareaProps as ChakraTextareaProps } from '@chakra-ui/react';
import { FieldWrapper, FieldWrapperProps } from './FieldWrapper';

export type TextareaProps<T extends FieldValues = FieldValues> = ChakraTextareaProps &
  FieldWrapperProps<T> &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function Textarea<T extends FieldValues>(props: TextareaProps<T>) {
  return (
    <FieldWrapper {...props}>
      {({ field, fieldState }) => (
        <ChakraTextarea
          _disabled={{ backgroundColor: 'blackAlpha.100' }}
          {...field}
          {...props}
          isInvalid={fieldState.invalid}
          errorBorderColor="red.300"
        />
      )}
    </FieldWrapper>
  );
}

export { Textarea };

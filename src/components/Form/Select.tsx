import { Select as ChakraSelect, SelectProps } from '@chakra-ui/react';
import { FieldValues } from 'react-hook-form';
import { FieldWrapper, FieldWrapperProps } from './FieldWrapper';

type Option = {
  value: any;
  label: string;
};

type Props<T extends FieldValues = FieldValues> = {
  placeholder?: string;
  options: Option[];
} & SelectProps &
  FieldWrapperProps<T> &
  React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

function Select<T extends FieldValues>({ options = [], ...props }: Props<T>) {
  return (
    <FieldWrapper {...props}>
      {({ field, fieldState }) => (
        <ChakraSelect
          _disabled={{
            backgroundColor: 'blackAlpha.100',
            color: 'blackAlpha.500',
          }}
          {...field}
          {...props}
          isInvalid={fieldState.invalid}
          errorBorderColor="red.300"
        >
          {options.map((option) => (
            <option key={option.value.toString()} value={option.value}>
              {option.label}
            </option>
          ))}
        </ChakraSelect>
      )}
    </FieldWrapper>
  );
}

export { Select };

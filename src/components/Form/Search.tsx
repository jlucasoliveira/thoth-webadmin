import {
  Input,
  InputProps,
  InputGroup,
  InputRightElement,
  IconButton,
  FormControl,
  Tooltip,
} from '@chakra-ui/react';
import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import React from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { FieldWrapperProps } from './FieldWrapper';

type Props<T extends FieldValues = FieldValues> = {
  placeholder?: string;
  handleSearch: () => void;
  clearSearch: () => void;
} & InputProps &
  Omit<FieldWrapperProps<T>, 'label'> &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function Search<T extends FieldValues>({ handleSearch, clearSearch, ...props }: Props<T>) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={(fieldProps) => (
        <FormControl isInvalid={fieldProps.fieldState.invalid}>
          <Tooltip
            hasArrow
            closeOnClick
            isDisabled={!fieldProps.fieldState.invalid}
            isOpen={fieldProps.fieldState.invalid}
            label={fieldProps.fieldState.error?.message}
            bg="blue.400"
          >
            <InputGroup>
              <Input
                {...fieldProps.field}
                {...props}
                isInvalid={fieldProps.fieldState.invalid}
                errorBorderColor="blue.300"
                rounded="full"
                borderStyle="solid"
                borderWidth="1px"
                borderColor="gray.390"
                bgColor="gray.100"
              />
              <InputRightElement>
                {fieldProps.field.value !== fieldProps.formState?.defaultValues?.[props.name] ? (
                  <IconButton
                    variant="unstyled"
                    size="sm"
                    minW={0}
                    rounded="full"
                    aria-label="Buscar termo informado"
                    onClick={clearSearch}
                    icon={<CloseIcon color="blue.400" />}
                  />
                ) : null}
                <IconButton
                  variant="unstyled"
                  minW={0}
                  rounded="full"
                  aria-label="Buscar termo informado"
                  onClick={handleSearch}
                  mx={2}
                  icon={<SearchIcon color="blue.400" />}
                />
              </InputRightElement>
            </InputGroup>
          </Tooltip>
        </FormControl>
      )}
    />
  );
}

export { Search };

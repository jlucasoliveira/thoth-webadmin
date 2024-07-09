import { useCallback } from 'react';
import { FieldValues, Path, PathValue, useController, useWatch } from 'react-hook-form';
import { Flex, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { ReactComponent as UploadIcon } from '@/assets/icons/navigation/upload.svg';
import { useGetAttachment } from '@/features/attachments/api/getAttachment';
import { basename } from '@/features/attachments/utils';
import { Size } from '@/features/attachments/types';
import { Preview } from '../Elements';
import { FieldWrapperProps } from '.';

type Props<T extends FieldValues = FieldValues> = {
  nameURLField: Path<T>;
  isDisabled?: boolean;
} & FieldWrapperProps<T> &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function FileInput<T extends FieldValues>({
  nameURLField,
  isDisabled,
  width = 25,
  ...props
}: Props<T>) {
  const object = useWatch({ control: props.control, name: nameURLField });
  const { field, fieldState } = useController({ control: props.control, name: props.name });
  const attachment = useGetAttachment({ id: object?.id, size: Size.L });

  const handleChange = useCallback(
    async (file: File) => {
      field.onChange(file as PathValue<T, Path<T>>);
    },
    [field]
  );

  return (
    <>
      <FormControl isInvalid={fieldState.invalid} isRequired={props.required}>
        <FormLabel style={props.labelStyles}>{props.label}</FormLabel>
        <Flex
          direction="row"
          h="10"
          borderRadius="md"
          p="4px"
          fontSize="md"
          borderColor={fieldState.invalid ? 'red.300' : isDisabled ? 'gray.100' : 'gray.300'}
          borderWidth={fieldState.invalid ? 2 : 1}
          justifyContent="space-between"
          backgroundColor={isDisabled ? 'blackAlpha.100' : undefined}
        >
          <label
            htmlFor={isDisabled ? undefined : `file-input-${props.name}`}
            style={{
              flexGrow: 10,
              marginLeft: 5,
              alignSelf: 'center',
              opacity: isDisabled ? 0.3 : 1,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width,
            }}
          >
            {field.value?.name ||
              field.value?.file?.name ||
              object?.key ||
              props.placeholder ||
              basename(attachment.data?.key) ||
              'Selecione um arquivo'}
          </label>
          <Flex direction="row" alignItems="center">
            <div style={{ marginRight: 10 }}>
              <UploadIcon style={{ opacity: isDisabled ? 0.3 : 1 }} />
            </div>
            <Preview
              title={props.label}
              file={field.value}
              attachment={attachment.data}
              isLoading={attachment.isLoading && attachment.isFetching}
            />
          </Flex>
        </Flex>
        {!fieldState.invalid ? <div style={{ minHeight: 'calc(19px + 0.5rem)' }} /> : null}
        <FormErrorMessage>
          {props.childErrorAttrName
            ? (fieldState.error as Record<string, any>)?.[props.childErrorAttrName]?.message
            : fieldState.error?.message}
        </FormErrorMessage>
        <input
          {...props}
          id={`file-input-${props.name}`}
          style={{ display: 'none' }}
          type="file"
          onChange={(e) => (e.target?.files?.[0] ? handleChange(e.target?.files?.[0]) : undefined)}
        />
      </FormControl>
    </>
  );
}

export { FileInput };

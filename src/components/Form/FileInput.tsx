import { useCallback, useState } from 'react';
import { FieldValues, Path, PathValue, useController } from 'react-hook-form';
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Image,
  Skeleton,
  useDisclosure,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ReactComponent as UploadIcon } from '@/assets/icons/navigation/upload.svg';
import { useGetSignedURI } from '@/features/attachments/api/getSignedURI';
import { useGetAttachment } from '@/features/attachments/api/getAttachment';
import { Loading, Preview } from '../Elements';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [preview, setPreview] = useState<string | undefined>();
  const { mutateAsync, isLoading } = useGetSignedURI();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    field: { value },
  } = useController({ control: props.control, name: nameURLField });
  const { field, fieldState } = useController({ control: props.control, name: props.name });
  const attachment = useGetAttachment({ id: value?.id });

  function handlePreUploadPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e?.target?.result) setPreview(e.target!.result as string);
    };
    reader.readAsDataURL(file);
  }

  const handleChange = useCallback(
    async (file: File) => {
      handlePreUploadPreview(file);
      const remote = await mutateAsync(file.name);
      field.onChange({ file, remote } as PathValue<T, Path<T>>);
    },
    [field, mutateAsync]
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
          borderColor={fieldState.invalid ? 'blue.300' : isDisabled ? 'gray.100' : 'gray.300'}
          borderWidth={fieldState.invalid ? 2 : 1}
          justifyContent="space-between"
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
              value?.key ||
              props.placeholder ||
              attachment.data?.attachment?.key ||
              'Selecione um arquivo'}
          </label>
          <Flex direction="row" alignItems="center">
            <div style={{ marginRight: 10 }}>
              {isLoading ? (
                <Loading size="sm" />
              ) : (
                <UploadIcon style={{ opacity: isDisabled ? 0.3 : 1 }} />
              )}
            </div>

            {attachment.isFetching && attachment.isLoading ? (
              <Loading size="sm" />
            ) : attachment.data?.presignedGetUrl || field.value?.file ? (
              <IconButton
                aria-label="Ver arquivo"
                variant="ghost"
                icon={<ViewIcon />}
                onClick={onOpen}
              />
            ) : null}
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
      <Preview title={props.label} isOpen={isOpen} onClose={onClose}>
        <Skeleton isLoaded={imageLoaded}>
          <Image
            fit="contain"
            boxSize="400px"
            src={preview || attachment.data?.presignedGetUrl}
            alt={props.label}
            onLoad={() => setImageLoaded(true)}
          />
        </Skeleton>
      </Preview>
    </>
  );
}

export { FileInput };

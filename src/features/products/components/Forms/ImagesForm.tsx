import { Button, Flex } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo, useRef } from 'react';
import { Control, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Preview, Table } from '@/components/Elements';
import { FileInput } from '@/components/Form/FileInput';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { basename } from '@/features/attachments/utils';
import { useSendFileToBucket } from '@/features/attachments/api/sendFileToBucket';
import { DeleteProductImage } from '../Delete/DeleteProductImage';
import { ImageFormType, imagesSchema } from './validation';

type ImagesType = {
  images?: ImageFormType[];
};

type ImagesFormProps = {
  variationId?: string;
  isEdit?: boolean;
  control: Control<ImagesType, any>;
};

function ImagesForm({ variationId, isEdit, control }: ImagesFormProps) {
  const pagesRef = useRef<number>(1);
  const { mutateAsync } = useSendFileToBucket();
  const images = useWatch({ control, name: 'images' });
  const { append, remove } = useFieldArray({ control, name: 'images' });
  const {
    control: internalControl,
    handleSubmit,
    reset,
  } = useForm({ resolver: yupResolver(imagesSchema) });

  const columns = useMemo<ColumnDef<ImageFormType>[]>(
    () => [
      {
        header: 'Nome',
        enableSorting: false,
        accessorFn: (row) =>
          basename(row.imageObject?.key) || row.image.name || `arquivo-${row._id}`,
      },
      {
        header: 'Ações',
        enableSorting: false,
        accessorKey: '_id',
        cell: (info) => {
          const index = info.row.index;
          const _id = info.getValue() as string | undefined;
          const row = info.row.original;
          const title = row.imageObject?.key || row.image?.name;

          return (
            <Flex direction="row">
              <Preview
                fetch
                attachmentId={row.id || row.imageObject?.id}
                title={title}
                file={row.image}
              />
              <DeleteProductImage id={_id ?? index} remove={remove} />
            </Flex>
          );
        },
      },
    ],
    [remove]
  );

  const onSubmit = useCallback(
    async (data: ImageFormType) => {
      if (variationId) {
        const attachment = await mutateAsync({
          file: data.image,
          variationId,
          resource: 'products.images',
        });
        append({ _id: attachment.id, image: data.image, imageObject: attachment });
      } else append(data);
      reset();
    },
    [variationId, append, reset, mutateAsync]
  );

  return (
    <>
      <FieldsContainer
        title="Imagens"
        templateColumn="1fr 1fr"
        gridProps={{ alignItems: 'center' }}
      >
        <FileInput
          isDisabled={!isEdit}
          control={internalControl}
          label="Imagem"
          name="image"
          nameURLField="imageObject"
        />
        <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
          Adicionar
        </Button>
      </FieldsContainer>
      <Table
        filtersContext="images"
        columns={columns}
        data={images ?? []}
        pages={pagesRef.current}
      />
    </>
  );
}

export { ImagesForm };

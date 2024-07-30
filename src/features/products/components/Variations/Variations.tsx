import { useCallback, useEffect, useMemo } from 'react';
import { ViewIcon } from '@chakra-ui/icons';
import { ColumnDef } from '@tanstack/react-table';
import { Control, useFieldArray } from 'react-hook-form';
import { Button, Flex, IconButton, UseDisclosureReturn } from '@chakra-ui/react';
import { useFilters } from '@/hooks/useFilters';
import { Loading, Table } from '@/components/Elements';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { useSendFileToBucket } from '@/features/attachments/api/sendFileToBucket';
import { useDeleteAttachment } from '@/features/attachments/api/deleteAttachment';
import { currencyFormat } from '@/utils/format';
import { Gender } from '../../types';
import { useCreateVariation } from '../../api/variations/createVariation';
import { useProductVariations } from '../../api/variations/getProductsVariation';
import { useVariationPartialUpdate } from '../../api/variations/partialUpdateVariation';
import { VARIATION_ID } from '../../utils/params';
import { translateGender } from '../../utils/translate';
import { DeleteVariation } from '../Delete/DeleteVariation';
import { FormType, parseVariationToForm } from '../Forms/validation';
import { VariationModal, FormPayload } from './VariationModal';
import { performCreation } from './utils';

type VariationsProps = Pick<UseDisclosureReturn, 'onOpen' | 'isOpen' | 'onClose'> & {
  productId?: number;
  isEdit?: boolean;
  control: Control<any, any>;
};

function Variations({ productId, control, isEdit, isOpen, onOpen, onClose }: VariationsProps) {
  const sendToBucket = useSendFileToBucket();
  const createVariation = useCreateVariation();
  const updateVariation = useVariationPartialUpdate();
  const deleteAttachment = useDeleteAttachment();
  const { query, addParam, getParam, removeParam } = useFilters({ context: 'variations' });
  const { data, isFetching, isLoading } = useProductVariations({ productId, params: query });
  const { fields, append, replace, remove } = useFieldArray<FormType>({
    control,
    name: 'variations',
  });
  const variationId = useMemo(() => getParam(VARIATION_ID) ?? undefined, [getParam]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      { header: 'Nome', enableSorting: false, accessorFn: (row) => row.variation ?? '-' },
      { header: 'Código de referência', enableSorting: false, accessorKey: 'externalCode' },
      {
        header: 'Valor',
        enableSorting: false,
        accessorFn: (row) => currencyFormat(row.price),
      },
      {
        header: 'Gênero',
        enableSorting: false,
        accessorFn: (row) => translateGender(row.gender as Gender),
      },
      { header: 'Volume', enableSorting: false, accessorKey: 'volume' },
      { header: 'Peso', enableSorting: false, accessorKey: 'weight' },
      {
        header: 'Ações',
        accessorKey: '_id',
        enableSorting: false,
        cell: (info) => {
          const id = info.getValue() as string | number | undefined;
          const isDisabled = id === undefined;
          const handleClick = () => {
            if (id) {
              addParam(VARIATION_ID, id.toString());
              onOpen();
            }
          };

          return (
            <Flex direction="row">
              <IconButton
                isDisabled={isDisabled}
                mr="2"
                variant="ghost"
                aria-label="Editor variação"
                icon={<ViewIcon />}
                size="xs"
                onClick={handleClick}
              />
              <DeleteVariation
                id={id}
                productId={productId}
                isDisabled={!isEdit || isDisabled}
                remove={remove}
              />
            </Flex>
          );
        },
      },
    ],
    [productId, isEdit, remove, addParam, onOpen]
  );

  const handleOnClose = useCallback(() => {
    removeParam(VARIATION_ID);
    onClose();
  }, [onClose, removeParam]);

  async function onSubmit({ form, variation }: FormPayload) {
    if (productId) {
      await performCreation(
        createVariation.mutateAsync,
        updateVariation.mutateAsync,
        sendToBucket.mutateAsync,
        deleteAttachment.mutateAsync,
        productId,
        { form, variation }
      );
    } else {
      append(form);
    }
    handleOnClose();
  }

  useEffect(() => {
    if (data?.data !== undefined) {
      replace(data.data.map(parseVariationToForm));
    }
  }, [data, replace]);

  if (isLoading && isFetching) return <Loading />;

  return (
    <>
      <FieldsContainer title="Variações" templateColumn={1}>
        <Button
          isDisabled={productId ? !isEdit : false}
          colorScheme="blue"
          mb="5"
          onClick={() => {
            removeParam(VARIATION_ID);
            onOpen();
          }}
        >
          Adicionar Variação
        </Button>
        <VariationModal
          key={variationId || 'add-variation'}
          isEdit={isEdit}
          isOpen={isOpen}
          onClose={handleOnClose}
          onSubmit={onSubmit}
          productId={productId}
          isLoading={
            createVariation.isLoading ||
            updateVariation.isLoading ||
            sendToBucket.isLoading ||
            deleteAttachment.isLoading
          }
        />
      </FieldsContainer>
      <Table forceScroll columns={columns} data={fields} pages={data?.meta?.pages ?? 1} />
    </>
  );
}

export { Variations };

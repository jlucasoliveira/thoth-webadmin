import { useCallback, useMemo } from 'react';
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
import { useVariationPartialUpdate } from '../../api/variations/partialUpdateVariation';
import { useCreateVariation } from '../../api/variations/createVariation';
import { useProductVariations } from '../../api/variations/getProductsVariation';
import { ProductVariationModel } from '../../types';
import { VARIATION_ID } from '../../utils/params';
import { DeleteVariation } from '../Delete/DeleteVariation';
import { VariationModal, FormPayload } from './VariationModal';
import { performCreation } from './utils';

type VariationsProps = Pick<UseDisclosureReturn, 'onOpen' | 'isOpen' | 'onClose'> & {
  productId?: string;
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
  const { remove, append } = useFieldArray({ control, name: 'variations' });
  const variationId = useMemo(() => getParam(VARIATION_ID) ?? undefined, [getParam]);

  const columns = useMemo<ColumnDef<ProductVariationModel>[]>(
    () => [
      { header: 'Nome', accessorFn: (row) => row.variation ?? '-' },
      { header: 'Código de referência', accessorKey: 'externalCode' },
      {
        header: 'Valor',
        accessorFn: (row) => currencyFormat(row.price),
      },
      {
        header: 'Ações',
        accessorKey: 'id',
        enableSorting: false,
        cell: (info) => {
          const id = info.getValue() as string;
          return (
            <Flex direction="row">
              <IconButton
                mr="2"
                variant="ghost"
                aria-label="Editor variação"
                icon={<ViewIcon />}
                size="xs"
                onClick={() => {
                  addParam(VARIATION_ID, id);
                  onOpen();
                }}
              />
              <DeleteVariation id={id} productId={productId} isDisabled={!isEdit} remove={remove} />
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

  if (isFetching && isLoading) return <Loading />;

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
      <Table columns={columns} data={data?.data ?? []} pages={data?.meta?.totalPages ?? 1} />
    </>
  );
}

export { Variations };

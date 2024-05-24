import { useEffect, useMemo } from 'react';
import {
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Path, Control, Resolver, useFieldArray, useForm, PathValue } from 'react-hook-form';
import { FieldsContainer } from '@/components/Form/FieldsContainer';
import { Form, Input, Textarea } from '@/components/Form';
import { FileInput } from '@/components/Form/FileInput';
import { useAttachments } from '@/features/attachments/api/getAttachments';
import { useFilters } from '@/hooks/useFilters';
import { FormProps } from '@/types/props';
import { useGetProductVariation } from '../../api/variations/getVariation';
import { ProductVariationModel } from '../../types';
import { VARIATION_ID } from '../../utils/params';
import { VariationForm, variationSchema } from '../Forms/validation';
import { ImagesForm } from '../Forms/ImagesForm';

const defaultValues: VariationForm = {
  externalCode: '',
  variation: '',
  price: 0,
};

export type FormPayload = {
  form: VariationForm;
  variation?: ProductVariationModel;
};

type Props = {
  productId: string;
  isLoading: boolean;
};

type VariationModalProps = FormProps<FormPayload, ProductVariationModel, Props> &
  Pick<UseDisclosureReturn, 'isOpen' | 'onClose'>;

function VariationModal(props: VariationModalProps) {
  const { query } = useFilters({ context: 'images' });
  const { getParam } = useFilters({ context: 'variations' });
  const variationId = useMemo(() => getParam(VARIATION_ID) ?? undefined, [getParam]);
  const { data, isLoading, isFetching } = useGetProductVariation({ id: variationId });
  const attachments = useAttachments({
    params: { ...query, filter: { ...query.filter, variationId: { eq: variationId } } },
    config: { enabled: !!variationId },
  });
  const loading = useMemo(
    () => (attachments.isLoading && attachments.isFetching) || (isLoading && isFetching),
    [attachments.isLoading, attachments.isFetching, isLoading, isFetching]
  );

  const { handleSubmit, control, setValue } = useForm<VariationForm>({
    defaultValues,
    resolver: yupResolver(variationSchema) as Resolver<VariationForm>,
  });

  const { replace } = useFieldArray({ control, name: 'images' });

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'iconId') setValue('iconObject.id', value as string);
        else if (value === null) setValue(key as Path<VariationForm>, '');
        else
          setValue(
            key as Path<VariationForm>,
            value as PathValue<VariationForm, Path<VariationForm>>
          );
      });
    }
  }, [setValue, data]);

  useEffect(() => {
    if (attachments.data?.data) {
      replace(
        attachments.data.data.map((attach) => ({
          _id: attach.id,
          image: new File([], ''),
          imageObject: attach,
        }))
      );
    }
  }, [attachments.data, replace]);

  return (
    <>
      <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent maxW="80%" rounded={8}>
          <ModalHeader display="flex" justifyContent="space-between">
            Dados da variante
            <Flex>
              <Button isDisabled={loading} variant="link" onClick={props.onClose} mr="5">
                Cancelar
              </Button>
              <Button
                isLoading={props.isLoading}
                isDisabled={loading || !props.isEdit}
                colorScheme="blue"
                onClick={handleSubmit((form) => props.onSubmit({ form, variation: data }))}
              >
                Salvar
              </Button>
            </Flex>
          </ModalHeader>
          <Form loading={loading}>
            <FieldsContainer templateColumn={3}>
              <Input
                isDisabled={props.isLoading || !props.isEdit}
                control={control}
                name="variation"
                label="Nome"
                required
              />
              <Input
                isDisabled={props.isLoading || !props.isEdit}
                control={control}
                name="externalCode"
                label="Código de referência"
                required
              />
              <Input
                isDisabled={props.isLoading || !props.isEdit}
                control={control}
                name="price"
                label="Preço"
                type="number"
                required
              />
              <FileInput
                required
                isDisabled={props.isLoading || !props.isEdit}
                control={control}
                label="Imagem Principal"
                name="icon"
                nameURLField="iconObject"
              />
            </FieldsContainer>
            <FieldsContainer templateColumn={1}>
              <Textarea
                isDisabled={props.isLoading || !props.isEdit}
                control={control}
                label="Código de barras"
                name="barcode"
              />
            </FieldsContainer>
            <ImagesForm
              control={control as Control<any, any>}
              isEdit={props.isEdit}
              variationId={variationId}
            />
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
}

export { VariationModal };

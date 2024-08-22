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
import { Form, Input, SearchableSelect, Select, Textarea } from '@/components/Form';
import { FileInput } from '@/components/Form/FileInput';
import { generateGenderOption } from '@/components/Form/utils';
import { useCategories } from '@/features/categories/api/getCategories';
import { useAttachments } from '@/features/attachments/api/getAttachments';
import { useFilters } from '@/hooks/useFilters';
import { FormProps } from '@/types/props';
import { useGetProductVariation } from '../../api/variations/getVariation';
import { Gender, ProductVariationModel } from '../../types';
import { VARIATION_ID } from '../../utils/params';
import { VariationForm, variationSchema } from '../Forms/validation';
import { ImagesForm } from '../Forms/ImagesForm';

const defaultValues: VariationForm = {
  externalCode: '',
  variation: '',
  price: 0,
  quantity: 0,
  gender: Gender.None,
};

export type FormPayload = {
  form: VariationForm;
  variation?: ProductVariationModel;
};

type Props = {
  productId: number;
  isLoading: boolean;
};

type VariationModalProps = FormProps<FormPayload, ProductVariationModel, Props> &
  Pick<UseDisclosureReturn, 'isOpen' | 'onClose'>;

function VariationModal(props: VariationModalProps) {
  const { query } = useFilters({ context: 'images' });
  const { getParam } = useFilters({ context: 'variations' });
  const variationId = useMemo(() => getParam(VARIATION_ID) ?? undefined, [getParam]);
  const { data, isLoading, isFetching } = useGetProductVariation({
    id: variationId,
    params: { include: { categories: true } },
  });
  const attachments = useAttachments({
    params: { ...query, filter: { ...query.filter, variationId: { eq: variationId } } },
    config: { enabled: !!variationId },
  });
  const loading = useMemo(
    () => (attachments.isLoading && attachments.isFetching) || (isLoading && isFetching),
    [attachments.isLoading, attachments.isFetching, isLoading, isFetching]
  );
  const genderOptions = useMemo(generateGenderOption, []);

  const { control, handleSubmit, reset, setValue } = useForm<VariationForm>({
    defaultValues,
    resolver: yupResolver(variationSchema) as Resolver<VariationForm>,
  });

  const { replace } = useFieldArray({ control, name: 'images' });

  async function onSubmit(form: VariationForm) {
    try {
      await props.onSubmit({ form, variation: data });
      reset();
    } catch (err) {
      console.error(err);
    }
  }

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
        <ModalContent maxH="80%" maxW="80%" rounded={8}>
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
                onClick={handleSubmit(onSubmit)}
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
                step={0.1}
                required
              />
              <SearchableSelect
                isMulti
                required
                isDisabled={!props.isEdit}
                control={control}
                name="categories"
                label="Categoria"
                placeholder="Pesquise uma categoria"
                isClearable={false}
                useFetch={useCategories}
                defaultOption={data?.categories}
                getOptionLabel={(option) => option.name}
                handleSetValue={(option) => setValue('categories', option)}
              />
              <Select
                required
                isDisabled={!props.isEdit}
                name="gender"
                control={control}
                label="Gênero"
                options={genderOptions}
              />
              <Input
                type="number"
                isDisabled={!props.isEdit}
                control={control}
                name="weight"
                label="Peso"
              />
              <Input
                type="number"
                isDisabled={!props.isEdit}
                control={control}
                name="volume"
                label="Volume"
              />
              <FileInput
                required
                isDisabled={props.isLoading || !props.isEdit}
                control={control}
                label="Imagem Principal"
                name="icon"
                nameURLField="iconObject"
              />
              {variationId ? null : (
                <Input
                  isDisabled={props.isLoading || !props.isEdit}
                  control={control}
                  name="quantity"
                  label="Quantidade em estoque"
                  type="number"
                  required
                />
              )}
              {variationId ? null : (
                <Input
                  isDisabled={props.isLoading || !props.isEdit}
                  control={control}
                  name="costPrice"
                  label="Custo de compra"
                  type="number"
                  required
                />
              )}
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
